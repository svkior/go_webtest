package element
import (
	"github.com/gorilla/websocket"
	"net/http"
	//"log"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
	"fmt"
	"log"
)


// Структура, описывающая устройство
type Device struct {
	// канал для широковещательной рассылки хени по конкретному прибору
	forward chan *Message
	// join - добавить клиента к серверу
	join chan Element
	// leave - убрать клиента из сервера
	leave chan Element
	// Все подключенные клиенты
	clients map[Element]bool
	// Канал для завершения работы устройства
	quit chan bool
	// tracer будет получать информацию об активности прибора
	Tracer trace.Tracer
	// Флаг запущенности ;-)
	running bool
}

/*
func (d *Device) AddElement(e Element){
	e.SetDevice(d)
	d.join <- e
	go e.Run()
}
*/

func (d *Device) closeClient(client Element){
	for element := range d.clients{
		element.UnsubscribeClient(client)
	}
	delete(d.clients, client)
	err := client.Quit()
	if err != nil {
		log.Println(err)
	}
	d.Tracer.Trace("Клиент ушел")
}

func (d *Device) Stop(){
	if(d.running){
		d.quit <- true
	}
}


func (d *Device) Run() error{
	if d.running{
		return ErrElementDeviceIsAlreadyRan
	}
	d.running = true
	go func(){
		for {
			select {
			case <- d.quit:
				// Прекращаем ранниться
				d.running = false
				return
			case client := <-d.join:
				d.clients[client] = true
				client.SetDevice(d)
				client.Run()
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
					for elem := range d.clients{
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
						case client.GetRecv() <- msg:
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

	}()
	return nil
}

const (
	socketBufferSize = 1024
	messageBufferSize = 256
)

var upgrader = &websocket.Upgrader{ReadBufferSize:socketBufferSize, WriteBufferSize:socketBufferSize}

func (d *Device) ServeHTTP(w http.ResponseWriter, req *http.Request){
	/*
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
		return
	}

	client := remoteClient{
		socket: socket,
		send: make(chan *Message, messageBufferSize),
		device: d,
	}
	d.join <- client
	defer func(){ d.leave <- client}()
	go client.write()
	client.read()
	*/
}


func NewDevice() *Device{
	return &Device{
		forward: make(chan *Message),
		join: make(chan Element),
		leave: make(chan Element),
		clients: make(map[Element]bool),
		Tracer: trace.Off(),
	}
}

