package main
import (
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test"
	"bitbucket.org/tts/light_dmx_go/ethconfig"
	"bitbucket.org/tts/goartnet"
	"runtime"
	"net"
	"time"
)

//FIXME: Число выходных каналов не меняется
//FIXME: Пересортируются каналы выходные
//FIXME: Только один выходной ArtNet присутствует

var artNet goartnet.Artnet

func roller(quitChan chan bool, o chan [512]byte) {
	var data [512]byte
	ticker := time.NewTicker(time.Millisecond * 100)
	for {
		select {
		case <-ticker.C:
			//log.Println("Send DMX!!!!!")
			for idx:=0; idx < 512; idx++{
				data[idx]++
			}
			o <- data
			//log.Println("DMX Sended")
		case <-quitChan:
			return
		}
	}
}

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

	var quitChans []chan bool

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
						portT := goartnet.NewInputPort(uint16(port.Universe))
						artNet.AddInputPort(portT)
					}
				}
				//TODO: Добавить входную коммутацию
			case "artout":
				log.Println("Хотим поменять параметры ArtnetOut")
				//TODO: Сохранить выходную коммутацию
				//TODO: Разлинковать выходную коммутацию
				for ii:=0; ii < len(quitChans);ii++ {
					quitChans[ii] <- true
				}
				quitChans = []chan bool{}
				//TODO: Очистить выходные порты
				artNet.ClearOutputPorts()
				//TODO: Добавить выходные порты
				ports := msg.Value.([]*artnet_test.ArtOut)
				for idx:=0; idx < len(ports); idx++ {
					port := ports[idx]
					if port.Enabled {
						portT := goartnet.NewOutputPort(uint16(port.Universe))
						quitChans = append(quitChans, make(chan bool))
						go roller(quitChans[len(quitChans)-1], portT.Input)
						artNet.AddOutputPort(portT)
					}
				}
				//TODO: Добавить выходную коммутацию
				artNet.EnableTxers()
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

	//artnet_test.GinApp()
	artnet_test.NewRestInterface()
}