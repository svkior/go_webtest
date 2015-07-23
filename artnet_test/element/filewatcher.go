package element
import (
	"time"
	"os"
	"log"
)

func NewFileWatcher(name string) Element{
	fw := fileWatcherElement{
		fileName: name,
		quit: make(chan bool),
		recv: make(chan *Message),
	}
	return &fw
}

type fileWatcherElement struct {
	device *device
	recv chan *Message
	fileName string
	quit chan bool
}

func (e *fileWatcherElement) GetElement() Element{
	return e
}

func (e *fileWatcherElement) Quit(){
	e.quit <- true
}


func (e *fileWatcherElement) SetDevice(d *device) {
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
	var msg Message
	msg.When = t
	msg.Type = "update"
	msg.Payload = "Update File Time"
	e.device.forward <- &msg
}

func (e *fileWatcherElement) Run() {
	var lastTime time.Time

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
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
