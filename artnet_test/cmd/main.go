package main
import (
	"log"
	"net/http"
	"bitbucket.org/tts/go_webtest/artnet_test"
)



func setupListener(ch artnet_test.SetupChan){
	log.Println("Слушаю сетапы")
	artnet_test.StartSetup()
	for {
		select {
		case msg := <- ch:
			log.Printf("MSG: %v", msg)
			switch msg.Name{
			case "eth":
				log.Println("Хотим поменять параметры Ethernet")
				// FIXME: Здесь нужно написать ifconfig
				//log.Printf("ifconfig eth0 %s %s",  msg.Value)
			case "artin":
				log.Println("Хотим поменять параметры ArtnetIn")
			case "artout":
				log.Println("Хотим поменять параметры ArtnetOut")
			}
		}
	}
}


func main() {
	var setupChan artnet_test.SetupChan
	// TODO: 1.Нужно сделать сигналы от сетапа сюда
	setupChan = artnet_test.GetSetupChan()

	// TODO: 2.Нужно сделать goroutine для запуска конфигурения
	go setupListener(setupChan)

	log.Println("Serving on port 3000")
	log.Fatal(http.ListenAndServe(":3000", artnet_test.NewApp()))
}