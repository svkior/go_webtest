package element
import "time"



type Element interface {
	GetElement() Element
	Run()
	Quit()
	SetDevice(*device)
	GetRecv() chan *Message
}


type Message struct {
	Type string `json:"type"`
	When time.Time `json:"when"`
	Payload interface{} `json:"payload"`
}
