package element

import (
	"time"
	"errors"
)


/* Интерфейс для элемента устройства, с которым будет налажено взаимодействие*/
type Element interface {
	// Запустить основной цикл элемента на исполнение
	Run() error
	// Остановить выполнение основного цикла элемента
	Quit() error
	// Установить device как родительский элемент данного устройства
	SetDevice(*Device)
	// Получить канал для передачи сообщений элементу
	GetRecv() chan *Message
	// Получить имя объекта
	GetName() string
	// Добавляем клиента к элементу
	SubscribeClient(client Element) error
	// Отписываем клиента от элемента
	UnsubscribeClient(client Element) error
}

type Message struct {
	Broadcast bool `json:"broadcast"`
	Type string `json:"type"`
	Name string `json:"name"`
	When time.Time `json:"when"`
	Client Element
	Payload interface{} `json:"payload"`
}

func GetEmptyMessage(mType string, broadcast bool) *Message{
	m := Message{
		Broadcast: broadcast,
		Type: mType,
		Name: "unicast",
		When: time.Now(),
		Payload: nil,
	}
	return &m
}

type ElementError error

var (
	ErrElementIsNotRunning		  	= ElementError(errors.New("Элемент не запущен"))
	ErrElementQuitClosed  		  	= ElementError(errors.New("Канал quit закрыт"))
	ErrElementSubscribeIsClosed   	= ElementError(errors.New("Канал subscribe закрыт"))
	ErrElementUnSubscribeIsClosed 	= ElementError(errors.New("Канал unsubscribe закрыт"))
	ErrElementIsAlreadyRunning 		= ElementError(errors.New("Элемент уже работает"))
	ErrElementClientIsNull			= ElementError(errors.New("Указатель на клиента нулевой"))
	ErrElementDeviceIsAlreadyRan    = ElementError(errors.New("Device уже запущен"))
)