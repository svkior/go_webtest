package main
import (
	"log"
	"net/http"
	"bitbucket.org/tts/go_webtest/artnet_test"
)



func setupListener(ch SetupChan){
	log.Println("Слушаю сетапы")
	for {
		select {
		case msg := <- ch:
			log.Printf("MSG: %v", msg)
		}
	}
}


func main() {
	var setupChan SetupChan

	setupChan = make(SetupChan)

	// TODO: 1.Нужно сделать сигналы от сетапа сюда

	// TODO: 2.Нужно сделать goroutine для запуска конфигурения
	go setupListener(setupChan)

	// FIXME: Тупо тест
	testMsg := MsgType{
		Name: "Имя",
		Value: "Значение",
	}

	setupChan <- testMsg

	log.Println("Serving on port 3000")
	log.Fatal(http.ListenAndServe(":3000", artnet_test.NewApp()))
}