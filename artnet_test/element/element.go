/*

  Element

  Интерфейс Element обеспечивает прозрачный интерфейс к элементам, входящим в устройство Device

 */
package element
import (
	"log"
	"sync"
)



// Абстрактный элемент от которого должны наследоваться
// все остальные элементы

type AbstractElement struct {
	// Канал, по которому осуществляется остановка процесса
	quit chan bool
	// Признак запуска процесса
	running bool
	// Канал подписки
	subscribe chan Element
	// Канал отписки
	unsubscribe chan Element
	// Уникальное имя элемента
	name string
	// Ссылка на девайс, которому принадлежит элемент
	device *Device
	// Канал получения входящих сообщений
	recv chan *Message
	// Карта обработчиков входных сообщений
	handlers map[string]func(*Message) (bool, error)
	// Обработчик по умолчанию
	defaultHandler func(*Message) (bool, error)
	// Карта подписанных клиентов
	clients map[Element]bool
	// Массив каналов выходов
	quits map[chan bool]bool
	// Лок для списка каналов quits
	quitsLock sync.Mutex
}

// Посылаем сообщение всем подписанным клиентам

func (e *AbstractElement) SendToSubscribers(msg *Message){
	for client := range e.clients{
//		log.Printf("TRY SEND TO %v", client)
		recv := client.GetRecv()
		select {
		case recv <- msg:
		default:
			log.Printf("ERROR SEND TO CLIENT %#v", client)
		// Не смогли послать
			e.device.closeClient(client)
		}
	}
}


// Подписываемся на канал для клиента
func (e *AbstractElement) SubscribeClient(client Element) error {
	//e.subscribe <- client
	if client == nil {
		return ErrElementClientIsNull
	}
	select {
	case e.subscribe <- client:
		return nil
	default:
		return ErrElementSubscribeIsClosed
	}
}

// Отписываеся от канала клиентом
func (e *AbstractElement) UnsubscribeClient(client Element) error{
	if e == client {
		log.Println("BUG!!! Can not unsubscribe itself")
		return nil
	}

	if client == nil {
		return ErrElementClientIsNull
	}

	select {
	case e.unsubscribe <- client:
		return nil
	default:
		return ErrElementUnSubscribeIsClosed
	}
}

// Возвращает уникальное имя элемента
func (e *AbstractElement) GetName() string {
	return e.name
}


// Метод Quit позволяет завершать работу программы
func (e *AbstractElement) Quit() error{
	if !e.running {
		return ErrElementIsNotRunning
	}
	select {
	case e.quit <- true:
		return nil
	default:
		return ErrElementQuitClosed
	}
}

func (c *AbstractElement) SetDevice(d *Device){
	c.device = d
}

func (c *AbstractElement) GetRecv() chan *Message {
	return c.recv
}

func (e *AbstractElement) Handle(name string, handler func(*Message) (bool, error)) (error){
	var err error
	e.handlers[name] = handler
	return err
}

func (e *AbstractElement) DefaultHandler(handler func(*Message) (bool, error)) {
	e.defaultHandler = handler
}

func (e *AbstractElement) RegisterQuitChannel(ch chan bool){
	e.quitsLock.Lock()
	defer e.quitsLock.Unlock()
	e.quits[ch] = true
}

func (e *AbstractElement) UnregisterQuitChannel(ch chan bool){
	e.quitsLock.Lock()
	defer e.quitsLock.Unlock()
	delete(e.quits, ch)
}

func (e *AbstractElement) Forward(msg *Message){
	if e.running && e.device != nil {
		e.device.forward <- msg
	}
}

func (c *AbstractElement) Run() error {
	if c.running {
		// Если уже работает
		return ErrElementIsAlreadyRunning
	}
	c.quit = make(chan bool)
	c.subscribe = make(chan Element)
	c.unsubscribe = make(chan Element)
	c.recv = make(chan *Message)

	canExit := make(chan bool)
	go func(){
		canExit <- true
		c.running = true
		for {
			select {
			case <-c.quit:
				for qCh := range c.quits{
					qCh <- true
					c.quitsLock.Lock()
					delete(c.quits, qCh)
					c.quitsLock.Unlock()
				}
				c.running = false
				return
			case client := <- c.subscribe:
				c.clients[client]= true
			case client := <- c.unsubscribe:
				delete(c.clients, client)
			case msg := <- c.recv:
				// Обрабатываем попадание в нужный хандлер
				if c.handlers[msg.Type] != nil {
					c.handlers[msg.Type](msg)
				} else if c.defaultHandler != nil {
					c.defaultHandler(msg)
				}
			}
		}
	}()
	<- canExit
	return nil
}

// Создание абстрактного элемента
func NewAbstractElement() *AbstractElement {
	return &AbstractElement{
		handlers: make(map [string]func(*Message) (bool, error)),
		clients: make(map [Element]bool),
		quits: make(map [chan bool]bool),
	}
}

