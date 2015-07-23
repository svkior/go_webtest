package artnet_test
import (
	"github.com/gorilla/websocket"
	"net/http"
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
)


// Структура, описывающая устройство
type device struct {
	// канал для широковещательной рассылки хени по конкретному прибору
	forward chan *message
	// join - добавить клиента к серверу
	join chan *remoteClient
	// leave - убрать клиента из сервера
	leave chan *remoteClient
	// Все подключенные клиенты
	clients map[*remoteClient]bool
	// tracer будет получать информацию об активности прибора
	tracer trace.Tracer
}


func (d *device) run(){
	for {
		select {
		case client := <-d.join:
			d.clients[client] = true
			d.tracer.Trace("Новый клиент подключился")
		case client := <-d.leave:
			delete(d.clients, client)
			close(client.send)
			d.tracer.Trace("Клиент ушел")
		case msg := <-d.forward:
			d.tracer.Trace("Message received from", string(msg.Name), ": ", string(msg.Message))
			for client := range d.clients {
				select {
				case client.send <- msg:
					// Сообщение ушло
				d.tracer.Trace(" -- ушло к клиенту")
				default:
					// Не смогли послать
					delete(d.clients, client)
					close(client.send)
					d.tracer.Trace(" -- Не ушло. ошибка подключения. удаляем сессию с клиентом")
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
		send: make(chan *message, messageBufferSize),
		device: d,
	}
	d.join <- client
	defer func(){ d.leave <- client}()
	go client.write()
	client.read()
}

func NewDevice() *device{
	return &device{
		forward: make(chan *message),
		join: make(chan *remoteClient),
		leave: make(chan *remoteClient),
		clients: make(map[*remoteClient]bool),
		tracer: trace.Off(),
	}
}