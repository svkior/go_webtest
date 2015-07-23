package element
import (
	"time"
)

// Создает ticker, который с периодичностью delay выдает
// тестовые сообщения
// Нужен для отладки интерфейса
func NewTicker(delay time.Duration) Element{
	fw := tickerElement{
		delay: delay,
		quit: make(chan bool),
		recv: make(chan *Message),
	}
	return &fw
}

/*
 Тестовый элемент Ticker для тестирования подписок и отписок
 */
type tickerElement struct {
	device *device
	recv chan *Message
	delay time.Duration
	quit chan bool
}

func (e *tickerElement) GetElement() Element{
	return e
}

func (e *tickerElement) Quit(){
	e.quit <- true
}


func (e *tickerElement) SetDevice(d *device) {
	e.device = d
}

func (e *tickerElement) GetRecv() chan *Message {
	return e.recv
}

func (e *tickerElement) sendUpdate(){
	msg := GetEmptyMessage("ticker", true)
	msg.Payload = "Тестовый тик"
	e.device.forward <- msg
}

func (e *tickerElement) Run() {

	ticker := time.NewTicker(e.delay)
	for {
		select {
		case <- ticker.C:
			e.sendUpdate()
		case <- e.quit:
			ticker.Stop()
			return
		}
	}
}
