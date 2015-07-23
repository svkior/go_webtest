package element
import (
	"time"
	"os"
	"log"
	"fmt"
)


// Структура, описывающая FileWatcher
type fileWatcherElement struct {
	device *Device
	subscribe chan *remoteClient
	unsubscribe chan *remoteClient
	recv chan *Message
	fileName string
	quit chan bool
	clients map[*remoteClient]bool
}


// Получение элемента, который следит за изменением указанного файла и в случае  изменения даты модификации посылается сообщение об изменении даты.
func NewFileWatcher(name string) Element{
	fw := fileWatcherElement{
		fileName: name,
		quit: make(chan bool),
		recv: make(chan *Message),
		subscribe: make(chan *remoteClient),
		unsubscribe: make(chan *remoteClient),
		clients: make(map[*remoteClient]bool),
	}
	return &fw
}


func (e *fileWatcherElement) SubscribeClient(client *remoteClient){
	e.subscribe <- client
}

func (e *fileWatcherElement) UnsubscribeClient(client *remoteClient){
	e.unsubscribe <- client
}



func (e *fileWatcherElement) GetName() string {
	return "respawn"
}


func (e *fileWatcherElement) GetElement() Element{
	return e
}

func (e *fileWatcherElement) Quit(){
	e.quit <- true
}


func (e *fileWatcherElement) SetDevice(d *Device) {
	e.device = d
}

func (e *fileWatcherElement) GetRecv() chan *Message {
	return e.recv
}

func (e *fileWatcherElement) getLasTime() (time.Time, error) {
	info, err := os.Stat(e.fileName)
	if err != nil {
		return time.Now(), err
	} else {
		return info.ModTime(), nil
	}
}


func (e *fileWatcherElement) sendUpdate(t time.Time){
	msg := GetEmptyMessage("reload", true)
	msg.Payload = "Update File Time"
	e.device.forward <- msg
}

func (e *fileWatcherElement) Run() {
	var lastTime time.Time

	lastTime, err  := e.getLasTime()
	if err != nil{
		log.Fatal(err)
		return
	}

	ticker := time.NewTicker(1 * time.Second)
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

		case <- ticker.C:
			modifiedtime, err := e.getLasTime()
			if err != nil {
				log.Fatal(err)
				e.quit <- true
			}
			if modifiedtime != lastTime{
				log.Println("Last modified time : ", modifiedtime)
				lastTime = modifiedtime
				e.sendUpdate(lastTime)
			}
		case <- e.quit:
			ticker.Stop()
			return
		}
	}
}
