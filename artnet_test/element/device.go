package element
import (
	"github.com/gorilla/websocket"
	"net/http"
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
)


// Структура, описывающая устройство
type device struct {
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


func (d *device) Run(){
	log.Println("Device RUNNED")
	for {
		select {
		case elem := <-d.joinElement:
			log.Println("Hey Joe")
			d.elements[elem] = true
		case elem := <-d.leaveElement:
			delete(d.elements, elem)
			elem.Quit()
		// подключение нового клиента
		case client := <-d.join:
			d.clients[client] = true
			d.Tracer.Trace("Новый клиент подключился")
		// отключение нового клиента
		case client := <-d.leave:
			delete(d.clients, client)
			close(client.send)
			d.Tracer.Trace("Клиент ушел")
		// Пришло сообщение для всех клиентов
		case msg := <-d.forward:
			d.Tracer.Trace("Message type", string(msg.Type))
			for client := range d.clients {
				select {
				case client.send <- msg:
					// Сообщение ушло
				d.Tracer.Trace(" -- ушло к клиенту")
				default:
					// Не смогли послать
					delete(d.clients, client)
					close(client.send)
					d.Tracer.Trace(" -- Не ушло. ошибка подключения. удаляем сессию с клиентом")
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

func (d *device) ServeHTTP(w http.ResponseWriter, req *http.Request){
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

func NewDevice() *device{
	return &device{
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

func (d *device) AddElement(e Element){
	e.SetDevice(d)
	d.joinElement <- e
	go e.Run()
}