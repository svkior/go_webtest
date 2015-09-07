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
	myQ chan bool
}

func (c *RemoteClient) Read(){
	for {
		var msg *Message
		if err := c.socket.ReadJSON(&msg); err == nil {
			msg.When = time.Now()
			msg.Client = c
			log.Printf("Got Message %#v", msg)
			if msg.Broadcast {
				c.Forward(msg)
				// По умолчанию шлем сообщения всем подписчиками
				// TODO: Более грамотный способ найти нужно
			} else {
				c.SendToSubscribers(msg)
			}
		} else {
			break
		}
	}
	c.socket.Close()
	//log.Println("PRE QUIT")
	c.quit <- true
	//log.Println("POST QUIT")
}

func (c *RemoteClient) WriteToJSON(msg *Message) (bool, error) {
	//log.Printf("Client %p Attend to write MSG: %v", c, msg)
	if err := c.socket.WriteJSON(msg); err != nil {
		c.socket.Close()
		c.quit <- true
	}
	return true, nil
}

func NewRemoteClient(conn *websocket.Conn) *RemoteClient{
	rc := &RemoteClient{
		socket:conn,
		AbstractElement: *NewAbstractElement(conn.RemoteAddr().String()),
		myQ: make(chan bool),
	}
	log.Printf("Create new remote client: %p",rc)
	rc.RegisterQuitChannel(rc.myQ)
	rc.DefaultHandler(rc.WriteToJSON)
	go func(){
		for{
			select{
			case <-rc.myQ:
				log.Println("WE GOT QUIT MESSAGE!!!!!, Closing Socket")
				rc.device.closeClient(rc)
				log.Printf("QUit was successful")
				rc.socket.Close()
				break
			}
		}
	}()
	return rc
}