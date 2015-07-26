/*
  В принципе о пакете:

  Этот пакет ....

 */
package element
import "errors"

/* Интерфейс для элемента устройства, с которым будет налажено взаимодействие*/
type Element interface {
	// Получить ссылку на элемент
	GetElement() Element
	// Запустить основной цикл элемента на исполнение
	Run()
	// Остановить выполнение основного цикла элемента
	Quit()
	// Установить device как родительский элемент данного устройства
	SetDevice(*Device)
	// Получить канал для передачи сообщений элементу
	GetRecv() chan *Message
	// Получить имя объекта
	GetName() string
	// Добавляем клиента к элементу
	SubscribeClient(client *remoteClient)
	// Отписываем клиента от элемента
	UnsubscribeClient(client *remoteClient)
}

type ElementError error

var (
	ErrElementIsNotRunning		  	= ElementError(errors.New("Элемент не запущен"))
	ErrElementQuitClosed  		  	= ElementError(errors.New("Канал quit закрыт"))
	ErrElementSubscribeIsClosed   	= ElementError(errors.New("Канал subscribe закрыт"))
	ErrElementUnSubscribeIsClosed 	= ElementError(errors.New("Канал unsubscribe закрыт"))
	ErrElementIsAlreadyRunning 		= ElementError(errors.New("Элемент уже работает"))
	ErrElementClientIsNull			= ElementError(errors.New("Указатель на клиента нулевой"))
)

// Абстрактный элемент от которого должны наследоваться
// все остальные элементы

type AbstractElement struct {
	// Канал, по которому осуществляется остановка процесса
	quit chan bool
	// Признак запуска процесса
	running bool
	// Канал подписки
	subscribe chan *remoteClient
	// Канал отписки
	unsubscribe chan *remoteClient
	// Уникальное имя элемента
	name string
	// Ссылка на девайс, которому принадлежит элемент
	device *Device
	// Канал получения входящих сообщений
	recv chan *Message
	// Карта обработчиков входных сообщений
	handlers map[string]func(*Message) (bool, error)
	// Карта подписанных клиентов
	clients map[*remoteClient]bool
	// Массив каналов выходов
	quits map[*bool]chan bool

}

// Подписываемся на канал для клиента

func (e *AbstractElement) SubscribeClient(client *remoteClient) error {
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
func (e *AbstractElement) UnsubscribeClient(client *remoteClient) error{
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

}

func (c *AbstractElement) Run() error {
	if c.running {
		// Если уже работает
		return ErrElementIsAlreadyRunning
	}
	c.running = true
	c.quit = make(chan bool)
	c.subscribe = make(chan *remoteClient)
	c.unsubscribe = make(chan *remoteClient)

	//canExit := make(chan bool)
	go func(){
//		<- canExit
		for {
			select {
			case client := <- c.subscribe:
				c.clients[client]= true
			case client := <- c.unsubscribe:
				delete(c.clients, client)
			case msg := <- c.recv:
				// Обрабатываем попадание в нужный хандлер
				if c.handlers[msg.Type] != nil {
					c.handlers[msg.Type](msg)
				}
			case <-c.quit:
				c.running = false
				return
			}
		}
	}()
//	<- canExit
	return nil
}

// Создание абстрактного элемента
func NewAbstractElement() *AbstractElement {
	return &AbstractElement{
		handlers: make(map [string]func(*Message) (bool, error)),
		clients: make(map [*remoteClient]bool),
	}
}

