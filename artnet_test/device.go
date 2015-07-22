package artnet_test
import (
	"github.com/gorilla/websocket"
	"net/http"
	"log"
)


// Структура, описывающая устройство
type device struct {
	// канал для широковещательной рассылки хени по конкретному прибору
	forward chan []byte
	// join - добавить клиента к серверу
	join chan *remoteClient
	// leave - убрать клиента из сервера
	leave chan *remoteClient
	// Все подключенные клиенты
	clients map[*remoteClient]bool
}


func (d *device) run(){
	for {
		select {
		case client := <-d.join:
			d.clients[client] = true
		case client := <-d.leave:
			delete(d.clients, client)
			close(client.send)
		case msg := <-d.forward:
			for client := range d.clients {
				select {
				case client.send <- msg:
					// Сообщение ушло
				default:
					// Не смогли послать
					delete(d.clients, client)
					close(client.send)
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
		send: make(chan []byte, messageBufferSize),
		device: d,
	}
	d.join <- client
	defer func(){ d.leave <- client}()
	go client.write()
	client.read()
}

func NewDevice() *device{
	return &device{
		forward: make(chan []byte),
		join: make(chan *remoteClient),
		leave: make(chan *remoteClient),
		clients: make(map[*remoteClient]bool),
	}
}
