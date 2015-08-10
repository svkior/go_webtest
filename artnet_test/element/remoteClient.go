package element
import (
	"github.com/gorilla/websocket"
	"time"
	"log"
)

/*

  Модуль обслуживает удаленные клиенты

 */

type RemoteClient struct {
	AbstractElement
	// Соединение с клиентом
	socket *websocket.Conn
}

func (c *RemoteClient) Read(){
	for {
		var msg *Message
		if err := c.socket.ReadJSON(&msg); err == nil {
			log.Printf("Got Message %v", msg)
			msg.When = time.Now()
			msg.Client = c
			c.Forward(msg)
		} else {
			break
		}
	}
	c.socket.Close()
	log.Println("PRE QUIT")
	c.quit <- true
	log.Println("POST QUIT")
}

func (c *RemoteClient) WriteToJSON(msg *Message) (bool, error) {
	log.Printf("Attend to write MSG: %v", msg)
	if err := c.socket.WriteJSON(msg); err != nil {
		c.socket.Close()
		log.Println("PRE QUIT2")
		c.quit <- true
		log.Println("POST QUIT2")
	}
	return true, nil
}

func NewRemoteClient(conn *websocket.Conn) *RemoteClient{
	rc := &RemoteClient{
		socket:conn,
	}
	log.Printf("Create new remote client: %v",rc)
	rc.DefaultHandler(rc.WriteToJSON)
	return rc
}