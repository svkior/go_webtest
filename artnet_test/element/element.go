/*
  В принципе о пакете:

  Этот пакет ....

 */
package element

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


