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
	// Если это сообщение должно уйти в форвард
	Broadcast bool `json:"broadcast"`
	// Тип сообщения
	Type string `json:"type"`
	// Имя канала
	Name string `json:"name"`
	// Время (проставляется на сервере)
	When time.Time `json:"when"`
	// Ссылка на клиента (проставляется на сервере)
	Client Element
	// Нагрузка, заполняется клиентом
	Payload interface{} `json:"payload"`
}

func GetEmptyMessage(mType string, broadcast bool, name string) *Message{
	m := Message{
		Broadcast: broadcast,
		Type: mType,
		Name: name,
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
	ErrElementIsAlreadySubscribed   = ElementError(errors.New("Element уже подписан"))
)
