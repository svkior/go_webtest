package ticker
import (
	"time"
	"runtime"
	"bitbucket.org/tts/go_webtest/artnet_test/element"
)

// Создает ticker, который с периодичностью delay выдает
// тестовые сообщения
// Нужен для отладки интерфейса
func NewTicker(delay time.Duration) element.Element{
	fw := tickerElement{
		delay: delay,
		myQuit: make(chan bool),
		message: *element.GetEmptyMessage("ping", false),
		AbstractElement: *element.NewAbstractElement(),
	}
	fw.RegisterQuitChannel(fw.myQuit)
	go fw.MyRun()
	return &fw
}

/*
 Тестовый элемент Ticker для тестирования подписок и отписок
 */

type tickerElement struct {
	element.AbstractElement
	delay time.Duration
	myQuit chan bool
	mem runtime.MemStats
	message element.Message
}

func (e *tickerElement) GetName() string {
	return "ticker"
}



type LocMemStat struct {
	Alloc uint64
}

// Главный цикл элемента ticker
func (e *tickerElement) MyRun() {

	ticker := time.NewTicker(e.delay)
	for {
		select {
		case <- ticker.C:
			e.sendUpdate()
		case <- e.myQuit:
			ticker.Stop()
			return
		}
	}
}


func (e *tickerElement) sendUpdate(){
	e.message.When = time.Now()

	//log.Printf("TICK: %v", e.message.When)
	runtime.GC()
	runtime.ReadMemStats(&e.mem)
	mal := LocMemStat{
		Alloc: e.mem.Alloc,
	}
	e.message.Payload = mal
	e.SendToSubscribers(&e.message)
}
