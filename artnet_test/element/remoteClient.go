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
	//log.Printf("Attend to write MSG: %v", msg)
	if err := c.socket.WriteJSON(msg); err != nil {
		c.socket.Close()
		c.quit <- true
	}
	return true, nil
}

func NewRemoteClient(conn *websocket.Conn) *RemoteClient{
	rc := &RemoteClient{
		socket:conn,
		AbstractElement: *NewAbstractElement(),
		myQ: make(chan bool),
	}
	log.Printf("Create new remote client: %v",rc)
	rc.RegisterQuitChannel(rc.myQ)
	rc.DefaultHandler(rc.WriteToJSON)
	go func(){
		for{
			select{
			case <-rc.myQ:
				log.Println("WE GOT QUIT MESSAGE!!!!!, Closing Socket")
				rc.socket.Close()
				break
			}
		}
	}()
	return rc
}