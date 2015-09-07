package chat
import (
	"bitbucket.org/tts/go_webtest/artnet_test/element"
	"log"
)

func NewChat(chatName string) element.Element{
	c := chatRoom{
		AbstractElement: *element.NewAbstractElement("room"),
		roomName: chatName,
	}
	c.Handle("message", c.ProcessMessage)
	return &c
}

type chatRoom struct {
	element.AbstractElement
	roomName string
}

func (c *chatRoom) GetName() string {
	return c.roomName
}
func (c *chatRoom) ProcessMessage(msg *element.Message) (bool, error){
	log.Println("Got Message")
	msgOut := element.GetEmptyMessage("chatMsg", false)
	msgOut.Name = "chatroom"
	msgOut.Payload = msg.Payload
	c.SendToSubscribers(msgOut)
	return true, nil
}
