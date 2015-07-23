package element


import (
	"github.com/gorilla/websocket"
	"time"
)

// wsclient представляет одного подключенного пользователя

type remoteClient struct {
	// Соединение с клиентом
	socket *websocket.Conn
	// Канал для посыла для этого конкретного клиента
	send chan *Message
	// Прибор для которого происходит настройка
	device *device
}

// Поток чтения из websocket
func (c *remoteClient) read(){
	for {
		var msg *Message
		if err := c.socket.ReadJSON(&msg); err == nil {
			msg.When = time.Now()
			c.device.forward <- msg
		} else {
			break
		}
	}
	c.socket.Close()
}

// Поток записи в websocket
func (c *remoteClient) write(){
	for msg := range c.send {
		if err := c.socket.WriteJSON(msg); err != nil {
			break
		}
	}
	c.socket.Close()
}
