package artnet_test


import "github.com/gorilla/websocket"

// wsclient представляет одного подключенного пользователя

type remoteClient struct {
	// Соединение с клиентом
	socket *websocket.Conn
	// Канал для посыла для этого конкретного клиента
	send chan []byte
	// Прибор для которого происходит настройка
	device *device
}

// Поток чтения из websocket
func (c *remoteClient) read(){
	for {
		if _, msg, err := c.socket.ReadMessage(); err == nil {
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
		if err := c.socket.WriteMessage(websocket.TextMessage, msg); err != nil {
			break
		}
	}
	c.socket.Close()
}
