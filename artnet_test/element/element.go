/*

  Element

  Интерфейс Element обеспечивает прозрачный интерфейс к элементам, входящим в устройство Device


 */
package element
import "log"



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
	// Карта подписанных клиентов
	clients map[Element]bool
	// Массив каналов выходов
	quits map[chan bool]bool
	// Канал на подписку quits в то время, когда run запущен
	joinQuits chan chan bool
	// Канал на отписку quit в то время, когда run запущен
	leaveQuits chan chan bool
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

func (e *AbstractElement) RegisterQuitChannel(ch chan bool){
	if(e.running){
		e.joinQuits <- ch
	} else {
		e.quits[ch] = true
	}
}

func (e *AbstractElement) UnregisterQuitChannel(ch chan bool){
	if(e.running){
		e.leaveQuits <- ch
	} else {
		delete(e.quits, ch)
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
	c.joinQuits = make(chan chan bool)
	c.leaveQuits = make(chan chan bool)
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
					delete(c.quits, qCh)
				}
				c.running = false
				return
			case quit := <- c.leaveQuits:
				delete(c.quits, quit)
			case quit := <- c.joinQuits:
				c.quits[quit] = true
			case client := <- c.subscribe:
				c.clients[client]= true
			case client := <- c.unsubscribe:
				delete(c.clients, client)
			case msg := <- c.recv:
				// Обрабатываем попадание в нужный хандлер
				if c.handlers[msg.Type] != nil {
					c.handlers[msg.Type](msg)
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

