package artnet_test

import (
	"github.com/gorilla/websocket"
)

// Комната для клиентов, пока только одна
type room struct {
	forward chan []byte
	join chan *wsClient
	leave chan *wsClient
	clients map[*wsClient]bool
}

func NewRoom() *room {
	return &room {
		forward: make(chan []byte),
		join: make(chan *wsClient),
		leave: make(chan *wsClient),
		clients: make(map[*wsClient]bool),
	}
}


func (r *room) run(){
	for {
		select {
			case client := <-r.join:
				// Присоединение клиента
				r.clients[client] = true
			case client := <-r.leave:
				// Отсоединить клиента
				delete(r.clients, client)
				close(client.send)
		case msg := <-r.forward:
			for client := range r.clients {
				select {
				case client.send <- msg:
					// Send The Message
				default:
					// Failed to send
					delete(r.clients, client)
					close(client.send)
				}
			}
		}
	}
}

// Клиент DMX In пока только чат
type wsClient struct {
	socket *websocket.Conn
	send chan []byte
	room *room
}

func (c *wsClient) read(){
	for {
		if _, msg, err := c.socket.ReadMessage(); err == nil {
			c.room.forward <- msg
		} else {
			break
		}
	}
	c.socket.Close()
}

func (c *wsClient) write(){
	for msg := range c.send {
		if err := c.socket.WriteMessage(websocket.TextMessage, msg); err != nil {
			break
		}
	}
	c.socket.Close()
}


const (
	socketBufferSize = 1024
	messageBufferSize = 256
)

var upgrader = &websocket.Upgrader{ReadBufferSize:socketBufferSize, WriteBufferSize:socketBufferSize}

