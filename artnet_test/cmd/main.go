package main
import (
	"log"
	"net/http"
	"bitbucket.org/tts/go_webtest/artnet_test"
	"bitbucket.org/tts/light_dmx_go/ethconfig"
	"bitbucket.org/tts/goartnet"
	"runtime"
	"net"
)

//FIXME: Число выходных каналов не меняется
//FIXME: Пересортируются каналы выходные
//FIXME: Только один выходной ArtNet присутствует


var artNet goartnet.Artnet


// Заглушка для windows, чтобы определить первый открытый интерфейс
func testingForInterfaces() string{
	ifaces, _ := net.Interfaces()
	for idx, iface := range ifaces{
		if (iface.Flags & net.FlagUp) != 0{
			log.Printf("Interface: %v || %v", idx, iface)
			return iface.Name
		}
	}
	return ""
}

func setupListener(ch artnet_test.SetupChan){
	log.Println("Слушаю сетапы")

	artNet = goartnet.Artnet{
		ShortName: "TTS ArtGate 4DR",
		LongName:  "TTS ArtGate 4DR 4x Artnet In 4x Artnet Out 4x Dmx In 4x Dmx Out",
	}
	var ethName string


	switch runtime.GOOS {
	case "darwin":
		ethName = "en0"
	case "linux":
		ethName = "eth0"
	case "windows":
		ethName = testingForInterfaces()
		if ethName == ""{
			log.Fatalf("Can't find ethernet interfaces on runtime %s", runtime.GOOS)
		}
	default:
		log.Fatalf("runtime %s is not supported yet", runtime.GOOS)
	}

	log.Printf("Running Artnet node: %s, Eth name: %s", artNet.LongName, ethName)

	err := artNet.SetupCtrl(&ethName)
	if err != nil {
		log.Fatal("Artnet Setup:", err)
	}

	// FIXME: Нужен более нормальный способ запуска artNet
	go artNet.Connect()
	for {
		select {
		case msg := <- ch:
			log.Printf("MSG: %v", msg)
			switch msg.Name{
			case "eth":
				ethconfig.UpdateEthernet(msg.Value.(ethconfig.EthSetup))
			case "artin":
				log.Println("Хотим поменять параметры ArtnetIn")
				//TODO: Сохранить входную коммутацию
				//TODO: Разлинковать входную коммутацию
				//TODO: Очистить входные порты
				artNet.ClearInputPorts()
				//TODO: Добавить входные порты
				ports := msg.Value.([]*artnet_test.ArtIn)
				for idx:=0; idx < len(ports); idx++ {
					port := ports[idx]
					if port.Enabled {
						portT := goartnet.NewInputPort(port.Universe)
						artNet.AddInputPort(portT)
					}
				}
				//TODO: Добавить входную коммутацию
			case "artout":
				log.Println("Хотим поменять параметры ArtnetOut")
				//TODO: Сохранить выходную коммутацию
				//TODO: Разлинковать выходную коммутацию
				//TODO: Очистить выходные порты
				artNet.ClearOutputPorts()
				//TODO: Добавить выходные порты
				ports := msg.Value.([]*artnet_test.ArtOut)
				for idx:=0; idx < len(ports); idx++ {
					port := ports[idx]
					if port.Enabled {
						portT := goartnet.NewOutputPort(port.Universe)
						artNet.AddOutputPort(portT)
					}
				}
				//TODO: Добавить выходную коммутацию
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