package artnet_test

import (
	"net"
	"strconv"
	"fmt"
	"log"
	"bitbucket.org/tts/light_dmx_go/ethconfig"
)

/*
   Идея с конфигурационными сообщениями следующая
    Создается локальный роутин, который может отправлять сообщения
 */

// Тип
type MsgType struct {
	Name string
	Value interface{}
}

type SetupChan chan MsgType

var globalChan chan string

var setupChan SetupChan


func GetSetupChan() SetupChan {
	return setupChan
}

func init(){
	globalChan = make(chan string)
	setupChan = make(SetupChan)
	go func(){
		for{
			select {
			case msg := <- globalChan:
				switch msg {
				// Нужно обновить информацию о Ethernet Адресе
				case "Update Ethernet":
					//log.Println("GLOCH Здесь апдейтим Ethernet")
					ethMsg := MsgType{
						Name: "eth",
						Value: globalSetup.Eth,
					}
					setupChan <- ethMsg
				case "Update ArtIn":
					//log.Println("Здесь апдейтим Artnet Inputs")
					ethMsg := MsgType{
						Name: "artin",
						Value: globalSetup.ArtIns,
					}
					setupChan <- ethMsg
				case "Update ArtOut":
					//log.Println("Здесь апдейтим Artnet Outputs")
					ethMsg := MsgType{
						Name: "artout",
						Value: globalSetup.ArtOuts,
					}
					setupChan <- ethMsg
				case "Start Setup":
					// TODO: Загрузка конфига из файла
					// TODO: Обновление конфигурации
					testMsg := MsgType{
						Name: "Имя",
						Value: "Значение",
					}

					setupChan <- testMsg
				}
			}
		}
	}()
}

// Функцию нужно вызывать при начале работы
func StartSetup(){
	globalChan <- "Start Setup"
}

func (s *Setup) UpdateEthernet(){
	globalChan <- "Update Ethernet"
}

func (s *Setup) UpdateArtIn(){
	globalChan <- "Update ArtIn"
}

func (s *Setup) UpdateArtOut(){
	globalChan <- "Update ArtOut"
}


type ArtIn struct {
	Universe uint16 // Вселенная
	Enabled bool
	Name    string // Имя Вселенной
}

type ArtOut struct {
	Universe uint16 // Вселенная
	Enabled bool
	Name string
}


type Setup struct {
	Eth          ethconfig.EthSetup // Установки Eth
	ArtnetInputs int    // Число входов ArtNet
	ArtIns	[]*ArtIn		// Входы ArtNet
	ArtnetOutputs int // Число выходов ArtNet
	ArtOuts []*ArtOut
}

func (s *Setup) UpdateIpAddr(ipAddr string) error {
	ipA := net.ParseIP(ipAddr)
	if ipA == nil {
		return errInvalidIP
	}
	s.Eth.IpAddress = ipAddr
	return nil
}

func (s *Setup) UpdateIpMask(ipMask string) error {
	ipM := net.ParseIP(ipMask)
	if ipM == nil {
		return errInvalidMask
	}
	s.Eth.IpMask = ipMask
	return nil
}

func (s *Setup) UpdateIpGateway(ipGw string) error {
	ipG := net.ParseIP(ipGw)
	if ipG == nil {
		return errInvalidGw
	}
	s.Eth.IpGw = ipGw
	return nil
}

func (s *Setup) UpdateMac(macs string) error {
	_,err := net.ParseMAC(macs)
	if err != nil {
		return errInvalidMAC
	}
	s.Eth.Mac = macs
	return nil
}

// Изменение числа входов
func (s *Setup) UpdateArtNetInputs(numArtnet string) error {
	i, err := strconv.Atoi(numArtnet)
	if err != nil{
		return errInvalidArtnetInputs
	}

	if i == s.ArtnetInputs {
		log.Println("Число портов не изменилось")
		return nil
	}
	log.Println("Число портов изменилось")
	// Нужно сделать следующее
	// 1 Взять из старого конфига все порты
	// 2 Переписать их в новый конфиг
	// 3 Дописать чистые конфиги по входам

	// Число входов, для которых нужно сохранить конфигурацию
	// Это число новых входов - число старых входов
	// Пример. Новых входов 4, Старых входов 0
	// 0 - 4 = -4 нам вообще не нужны старые входы
	// Новых входов 4, Старых входов 3
	// 4-3 =
	tmpArtIns := s.ArtIns
	s.ArtIns = []*ArtIn{}
	idx := 0
	for ; idx < i; idx++{
		if idx < s.ArtnetInputs {
			s.ArtIns = append(s.ArtIns, tmpArtIns[idx])
		} else {
			s.ArtIns = append(s.ArtIns,&ArtIn{
				Enabled: false,
				Universe: 0,
				Name: fmt.Sprintf("tag%d",idx),
			})
		}
	}
	for ; idx < s.ArtnetInputs; idx++{
		tmpArtIns[idx] = nil
	}
	s.ArtnetInputs = i

	return nil
}

func (s *Setup) UpdateArtNetOutputs(numArtnet string) error {
	i, err := strconv.Atoi(numArtnet)
	if err != nil{
		return errInvalidArtnetOutputs
	}

	tmpArtOuts := s.ArtOuts
	s.ArtOuts = []*ArtOut{}
	idx := 0
	for ; idx < i; idx++{
		if idx < s.ArtnetOutputs {
			s.ArtOuts = append(s.ArtOuts, tmpArtOuts[idx])
		} else {
			s.ArtOuts = append(s.ArtOuts,&ArtOut{
				Enabled: false,
				Universe: 0,
				Name: fmt.Sprintf("tag%d",idx),
			})
		}
	}
	for ; idx < s.ArtnetOutputs; idx++{
		tmpArtOuts[idx] = nil
	}
	s.ArtnetOutputs = i

	return nil
}


func (s *Setup) EnableArtnetIn(idx int){
	//log.Printf("Value before: %v", s.ArtIns[idx].Enabled)
	s.ArtIns[idx].Enabled = true
	//log.Printf("Value after: %v", s.ArtIns[idx].Enabled)
}

func (s *Setup) DisableArtnetIn(idx int){
	//log.Printf("Value before: %v", s.ArtIns[idx].Enabled)
	s.ArtIns[idx].Enabled = false
	//log.Printf("Value after: %v", s.ArtIns[idx].Enabled)
}

func (s *Setup) EnableArtnetOut(idx int){
	s.ArtOuts[idx].Enabled = true
}

func (s *Setup) DisableArtnetOut(idx int){
	s.ArtOuts[idx].Enabled = false
}

func (s *Setup) UpdateArtNetInUniverse(idx int, v string) error {

	i, err := strconv.Atoi(v)
	if err != nil{
		return errInvalidUniverse
	}
	s.ArtIns[idx].Universe = uint16(i)
	return nil
}

func (s *Setup) UpdateArtNetOutUniverse(idx int, v string) error {

	i, err := strconv.Atoi(v)
	if err != nil{
		return errInvalidUniverse
	}
	s.ArtOuts[idx].Universe = uint16(i)
	return nil
}


func NewSetup() *Setup {

	return &Setup{
		Eth: ethconfig.EthSetup{
			IpAddress: "10.101.0.245",
			IpMask: "255.0.0.0",
			IpGw: "10.0.0.1",
			Mac: "00:01:02:03:04:05",
		},
		ArtnetInputs: 0,
		ArtIns: []*ArtIn{},
		ArtnetOutputs:0,
		ArtOuts: []*ArtOut{},
	}
}

var globalSetup *Setup

func init(){
	globalSetup = NewSetup()
}
