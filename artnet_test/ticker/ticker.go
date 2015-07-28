package ticker
import (
	"time"
	"fmt"
	"runtime"
)

// Создает ticker, который с периодичностью delay выдает
// тестовые сообщения
// Нужен для отладки интерфейса
func NewTicker(delay time.Duration) Element{
	fw := tickerElement{
		delay: delay,
		quit: make(chan bool),
		recv: make(chan *Message),
		subscribe: make(chan *remoteClient),
		unsubscribe: make(chan *remoteClient),
		clients: make(map[*remoteClient]bool),
		message : GetEmptyMessage("ticker", true),
	}
	return &fw
}

/*
 Тестовый элемент Ticker для тестирования подписок и отписок
 */
type tickerElement struct {
	device *Device
	subscribe chan *remoteClient
	unsubscribe chan *remoteClient
	recv chan *Message
	delay time.Duration
	quit chan bool
	clients map[*remoteClient]bool
	message *Message
	mem runtime.MemStats
}

func (e *tickerElement) SubscribeClient(client *remoteClient){
	e.subscribe <- client
}

func (e *tickerElement) UnsubscribeClient(client *remoteClient){
	e.unsubscribe <- client
}

func (e *tickerElement) GetName() string {
	return "ticker"
}


func (e *tickerElement) Quit(){
	e.quit <- true
}


func (e *tickerElement) SetDevice(d *Device) {
	e.device = d
}

func (e *tickerElement) GetRecv() chan *Message {
	return e.recv
}


type LocMemStat struct {
	Alloc uint64
}

// Главный цикл элемента ticker
func (e *tickerElement) Run() {

	ticker := time.NewTicker(e.delay)
	for {
		select {
		case client := <- e.unsubscribe:
			e.device.Tracer.Trace(fmt.Sprintf("Нужно отписать Клиента %p от канала %s", client, e.GetName()))
			if( e.clients[client]){
				delete(e.clients, client)
				e.device.Tracer.Trace("Удалили")
			}
		case client := <- e.subscribe:
			e.device.Tracer.Trace(fmt.Sprintf("Клиент %p хочет подключиться к каналу %s", client, e.GetName()))
			e.clients[client] = true
		case <- ticker.C:
			e.sendUpdate()
		case <- e.quit:
			ticker.Stop()
			return
		}
	}
}


func (e *tickerElement) sendUpdate(){
	e.message.When = time.Now()
	runtime.GC()
	runtime.ReadMemStats(&e.mem)
	mal := LocMemStat{
		Alloc: e.mem.Alloc,
	}
	e.message.Payload = mal

	for client := range e.clients {
		select {
		case client.send <- e.message:
		// Сообщение ушло
		   e.device.Tracer.Trace(" -- tickerElement ушло к клиенту")
		default:
		// Не смогли послать
			//FIXME: прибить клиента
			e.device.closeClient(client)
			e.device.Tracer.Trace(" -- tickerElement. Ошибка. Несмог послать клиенту")
		}
	}
	//e.device.forward <- msg
}


func (e *tickerElement) GetElement() Element{
	return e
}