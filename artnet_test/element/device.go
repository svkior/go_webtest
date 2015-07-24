package element
import (
	"github.com/gorilla/websocket"
	"net/http"
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
	"fmt"
)


// Структура, описывающая устройство
type Device struct {
	// канал для широковещательной рассылки хени по конкретному прибору
	forward chan *Message
	// join - добавить клиента к серверу
	join chan *remoteClient
	// leave - убрать клиента из сервера
	leave chan *remoteClient
	// Все подключенные клиенты
	clients map[*remoteClient]bool
	// joinElement - добавить элемент
	joinElement chan Element
	// Убрать элемента из сервера
	leaveElement chan Element
	// Все подключенные элементы
	elements map[Element]bool
	// tracer будет получать информацию об активности прибора
	Tracer trace.Tracer
}

func (d *Device) closeClient(client *remoteClient){
	for element := range d.elements{
		element.UnsubscribeClient(client)
	}
	delete(d.clients, client)
	close(client.send)
	d.Tracer.Trace("Клиент ушел")
	// TODO: Отписаться от всех подписанных каналов для клиента
}


func (d *Device) Run(){
	log.Println("Device RUNNED")
	for {
		select {
		case elem := <-d.joinElement:
			d.elements[elem] = true
		case elem := <-d.leaveElement:
			delete(d.elements, elem)
			//TODO: Не происходит отписка от всех нужных каналов
			elem.Quit()
		// подключение нового клиента
		case client := <-d.join:
			d.clients[client] = true
			d.Tracer.Trace("Новый клиент подключился")
		// отключение нового клиента
		case client := <-d.leave:
			d.closeClient(client)

		// Пришло сообщение от клиента
		case msg := <-d.forward:
			//d.Tracer.Trace("Message type", string(msg.Type))
			switch msg.Type{
			// Подписка на каналы
			case "subscribe":
				d.Tracer.Trace(fmt.Sprintf("Client %p wants to subscribe to channels", msg.Client))
				d.Tracer.Trace(fmt.Sprintf("Что говорит список клиентов? : %v", d.clients[msg.Client]))
				d.Tracer.Trace(fmt.Sprintf("Хочет подписаться на канал: %s", msg.Name))
				//TODO: Сделать идентификатор элемента, сделать маппинг
				for elem := range d.elements{
					if elem.GetName() == msg.Name{
						d.Tracer.Trace(fmt.Sprintf("Есть такой канал"))
						// Добавляем клиента в очередь отправки сообщений
						elem.SubscribeClient(msg.Client)
					}
				}
			// Отписка от каналов
			case  "unsubscribe":
				//TODO: Отписаться от канала
			// Положить запись на канал
			case "send":
				//TODO: отослать в канал запись
			// Послать список доступных каналов
			case "list":
				//TODO: Послать список доступных каналов
			// Запрос авторизации
			case "auth":
				//TODO: Обработать запрос авторизации
			// Освобождение от авторизации
			case "unauth":
				//TODO: Обработать запрос об разавторизации
			}

			// Пока не разобрались все пакеты считаем броадкастными
			broadcast := msg.Broadcast
			// По умолчанию ничего не посылаем
			send := false
			// Проходимся по всем клиентам
			for client := range d.clients {
				if(broadcast){
					// Если броадкастовый пакет, то полюбому шлем всем
					send = true
				} else {
					// Если не броадкастовый, то шлем не всем
					if(client == msg.Client){
						d.Tracer.Trace("ТАкой клиент реально есть")
					}
					send = true
				}

				if(send){
					select {
					case client.send <- msg:
					// Сообщение ушло
						//d.Tracer.Trace(" -- ушло к клиенту")
					default:
					// Не смогли послать
						d.closeClient(client)
						d.Tracer.Trace(" -- Не ушло. ошибка подключения. удаляем сессию с клиентом")
					}
				}
			}
		}
	}
}

const (
	socketBufferSize = 1024
	messageBufferSize = 256
)

var upgrader = &websocket.Upgrader{ReadBufferSize:socketBufferSize, WriteBufferSize:socketBufferSize}

func (d *Device) ServeHTTP(w http.ResponseWriter, req *http.Request){
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
		return
	}
	client := &remoteClient{
		socket: socket,
		send: make(chan *Message, messageBufferSize),
		device: d,
	}
	d.join <- client
	defer func(){ d.leave <- client}()
	go client.write()
	client.read()
}


func NewDevice() *Device{
	return &Device{
		forward: make(chan *Message),
		join: make(chan *remoteClient),
		leave: make(chan *remoteClient),
		joinElement: make(chan Element),
		leaveElement: make(chan Element),
		clients: make(map[*remoteClient]bool),
		elements: make(map[Element]bool),
		Tracer: trace.Off(),
	}
}

func (d *Device) AddElement(e Element){
	e.SetDevice(d)
	d.joinElement <- e
	go e.Run()
}