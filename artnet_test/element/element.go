package element




type Element interface {
	GetElement() Element
	Run()
	Quit()
	SetDevice(*device)
	GetRecv() chan *Message
}


