package filewatcher
import (
	"time"
	"os"
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test/element"
)


// Структура, описывающая FileWatcher
type fileWatcherElement struct {
	element.AbstractElement
	fileName string
	myQ chan bool
}


// Получение элемента, который следит за изменением указанного файла и в случае  изменения даты модификации посылается сообщение об изменении даты.
func NewFileWatcher(name string) *fileWatcherElement{
	fw := fileWatcherElement{
		fileName: name,
		myQ: make(chan bool),
		AbstractElement: *element.NewAbstractElement(),
	}
	fw.RegisterQuitChannel(fw.myQ)
	go fw.localRun()
	return &fw
}

func (e *fileWatcherElement) GetName() string {
	return "respawn"
}

func (e *fileWatcherElement) getLasTime() (time.Time, error) {
	info, err := os.Stat(e.fileName)
	if err != nil {
		return time.Now(), err
	} else {
		return info.ModTime(), nil
	}
}

// FIXME: должны получать только подписанные клиенты
func (e *fileWatcherElement) sendUpdate(t time.Time){
	msg := element.GetEmptyMessage("reload", false)
	msg.Payload = "Update File Time"
	e.SendToSubscribers(msg)
}

func (e *fileWatcherElement) localRun() {
	var lastTime time.Time

	lastTime, err  := e.getLasTime()
	if err != nil{
		log.Fatal(err)
		return
	}

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <- ticker.C:
			modifiedtime, err := e.getLasTime()
			if err != nil {
				log.Fatal(err)
				e.Quit()
			}
			if modifiedtime != lastTime{
				log.Println("Last modified time : ", modifiedtime)
				lastTime = modifiedtime
				e.sendUpdate(lastTime)
			}
		case <- e.myQ:
			ticker.Stop()
			return
		}
	}
}
