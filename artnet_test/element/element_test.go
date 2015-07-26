package element

import (

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	//"github.com/golang/mock/gomock"
	"time"
)

func waitForMillisecond(){
	time.Sleep(1 * time.Millisecond)
}

var _ = Describe("Element", func() {

	Describe("Описываем наличие absElement", func(){

		Context("NewAbstractElement должно возвращать тип AbstractElement", func(){

			var newAbsEl *AbstractElement

			BeforeEach(func(){
				newAbsEl = NewAbstractElement()
			})


			It("Проверяем что возвращается то что нужно", func(){
				Expect(newAbsEl).Should(BeAssignableToTypeOf(&AbstractElement{}))
			})
			It("Возвращаемый элемент не должен быть nil", func(){
				Expect(newAbsEl).ShouldNot(BeNil())
			})
		})


		Context("Проверяем наличие полей в голой структуре", func(){

			var (
				absElement AbstractElement
			)

			BeforeEach(func(){
				absElement = AbstractElement{}
			})

			It("Должно принимать AbstractElement", func(){
				Expect(absElement).Should(BeAssignableToTypeOf(AbstractElement{}))
			})

			It("Есть поле running типа bool", func(){
				Expect(absElement.running).Should(BeAssignableToTypeOf(true))
				Expect(absElement.running).ShouldNot(BeTrue())
			})

			It("Есть поле quit типа chan bool", func(){
				var cb chan bool
				Expect(absElement.quit).Should(BeAssignableToTypeOf(cb))
			})

			It("Есть поле subscribe типа chan *remoteClient", func(){
				var ce chan *remoteClient
				Expect(absElement.subscribe).Should(BeAssignableToTypeOf(ce))
			})

			It("Есть поле unsubscribe типа chan *remoteClient", func(){
				var ce chan *remoteClient
				Expect(absElement.unsubscribe).Should(BeAssignableToTypeOf(ce))
			})

			It("Есть поле name типа string", func(){
				Expect(absElement.name).Should(BeAssignableToTypeOf("123"))
			})

			It("Есть поле device типа *Device", func(){
				Expect(absElement.device).Should(BeAssignableToTypeOf(&Device{}))
			})

			It("Есть поле recv типа chan *Message", func(){
				var cm chan *Message
				Expect(absElement.recv).Should(BeAssignableToTypeOf(cm))
			})

			It("Есть массив функций обработчиков handlers", func(){
				var handlers  map[string]func(*Message) (bool, error)
				Expect(absElement.handlers).Should(BeAssignableToTypeOf(handlers))
			})

			It("Есть массив подписанных клиентов clients", func(){
				var clients map[*remoteClient]bool
				Expect(absElement.clients).Should(BeAssignableToTypeOf(clients))
			})

			It("Есть массив каналов quits для завершения goroutines ", func(){
				var quits map[*bool]chan bool
				Expect(absElement.quits).Should(BeAssignableToTypeOf(quits))
			})

		})


		Context("Проверяем соответствие для Element интерфейса", func(){
			var newAbsEl *AbstractElement

			BeforeEach(func(){
				newAbsEl = NewAbstractElement()
			})

			It("Метод Quit должен возвращать ошибку в том случае, если элемент не работает", func(){
				newAbsEl.quit = make(chan bool, 1)
				err := newAbsEl.Quit()
				Expect(err).ShouldNot(BeNil())
				Expect(err).Should(BeEquivalentTo(ErrElementIsNotRunning))
			})

			It("Метод Quit посылает сообщение по каналу Quit в том случае, если элемент работает", func(){
				newAbsEl.quit = make(chan bool, 1)
				newAbsEl.running = true
				newAbsEl.Quit()
				Expect(len(newAbsEl.quit)).Should(Equal(1))
				close(newAbsEl.quit)
			})

			It("Метод Quit возвращает ошибку если канал закрыт", func(){
				newAbsEl.running = true
				err := newAbsEl.Quit()
				Expect(err).Should(Equal(ErrElementQuitClosed))
			})

			It("Метод SubscribeCLient возвращает ошибку если канал закрыт", func(){
				err := newAbsEl.SubscribeClient(&remoteClient{})
				Expect(err).Should(Equal(ErrElementSubscribeIsClosed))
			})

			It("Метод SubscribeCLient должен вызываться", func(){
				newAbsEl.subscribe = make(chan *remoteClient, 1)
				err := newAbsEl.SubscribeClient(&remoteClient{})
				Expect(err).Should(BeNil())
				Expect(len(newAbsEl.subscribe)).Should(Equal(1))
			})

			It("Метод UnsubscribeClien возвращает ошибку, если клиент нулевой", func(){
				err := newAbsEl.UnsubscribeClient(nil)
				Expect(err).ShouldNot(BeNil())
				Expect(err).Should(Equal(ErrElementClientIsNull))
			})

			It("Метод UnsubscribeClien возвращает ошибку, если канал закрыт", func(){
				err := newAbsEl.UnsubscribeClient(&remoteClient{})
				Expect(err).ShouldNot(BeNil())
				Expect(err).Should(Equal(ErrElementUnSubscribeIsClosed))
			})

			It("Метод UnSubscribeCLient должен вызываться", func(){
				newAbsEl.unsubscribe = make(chan *remoteClient, 1)
				err := newAbsEl.UnsubscribeClient(&remoteClient{})
				Expect(err).Should(BeNil())
				Expect(len(newAbsEl.unsubscribe)).Should(Equal(1))
			})

			It("Метод GetName возвращает string", func(){
				val := newAbsEl.GetName()
				Expect(val).Should(BeAssignableToTypeOf("string"))
				Expect(val).Should(Equal(""))
			})

			It("Метод GetName возвращает значение .name", func(){
				newAbsEl.name = "testing test test1"
				val := newAbsEl.GetName()
				Expect(val).Should(Equal(newAbsEl.name))
			})

			It("Метод SetDevice устанавливает значение .device", func(){
				myDev := Device{}
				newAbsEl.SetDevice(&myDev)
				Expect(newAbsEl.device).Should(BeEquivalentTo(&myDev))
			})

			It("Метод GetRecv возвращает значение .recv", func(){
				var cm chan *Message
				cm = make(chan *Message)
				newAbsEl.recv = cm
				val := newAbsEl.GetRecv()
				Expect(val).Should(BeAssignableToTypeOf(newAbsEl.recv))
				Expect(val).Should(BeEquivalentTo(cm))
			})

			It("После метода NewAbstractElement handlers не должен быть нулевым", func(){
				Expect(newAbsEl.handlers).ShouldNot(BeNil())
			})

			It("Есть функция задания обработчика входящей очереди", func(){
				var handler func(*Message) (bool, error)
				handler = func(m *Message) (bool, error) {
					return true, nil
				}
				Expect(newAbsEl.Handle("status",handler)).Should(BeNil())
			})

			It("После метода NewAbstractElement clients не должен быть нулевым", func(){
				Expect(newAbsEl.clients).ShouldNot(BeNil())
			})

		})

		Context("Запускаем элемент на исполнение", func() {
			var newAbsEl *AbstractElement

			BeforeEach(func() {
				newAbsEl = NewAbstractElement()
			})

			AfterEach(func(){
				newAbsEl.Quit()
			})


			It("Метод Run запускает главный цикл возвращает тип ошибки", func() {
				er := newAbsEl.Run()
				Expect(er).Should(BeNil())
			})

			It("После запуска Run() running будет true", func(){
				newAbsEl.Run()
				Expect(newAbsEl.running).Should(BeTrue())
			})

			It("При запуске Run() c running = true выдается ошибка повторного запуска", func(){
				newAbsEl.running = true
				err := newAbsEl.Run()
				Expect(err).Should(Equal(ErrElementIsAlreadyRunning))
				// Чтобы нормально закрылся
				newAbsEl.running = false
			})

			It("При запуске Run() канал quit открыт", func(){
				err := newAbsEl.Run()
				Expect(err).Should(BeNil())
				Expect(newAbsEl.quit).ShouldNot(BeNil())
			})

			It("При запуске Run() с последующей остановкой Quit() состояние running = false", func(){
				newAbsEl.Run()
				waitForMillisecond()
				Expect(newAbsEl.running).Should(BeTrue())
				err := newAbsEl.Quit()
				Expect(err).Should(BeNil())
				waitForMillisecond()
				Expect(newAbsEl.running).Should(BeFalse())
			})


		})

		Context("Проверка Handlers в работе", func(){
			var newAbsEl *AbstractElement
			var catched int
			var handler func(*Message) (bool, error)

			BeforeEach(func() {
				newAbsEl = NewAbstractElement()
				catched = 0
				handler = func(m *Message) (bool, error) {
					catched++
					return true, nil
				}
			})

			AfterEach(func(){
				newAbsEl.Quit()
			})

			It("Добавляем handler, проверяем, что он появился в списке handlers", func(){
				newAbsEl.Handle("test", handler)
				Expect(len(newAbsEl.handlers)).Should(Equal(1))

			})

			It("Запускаем Run(), получаем в recv сообщение, это сообщение должно попадать в handler",func(){
				// Мы заменяем канал recv на подставной, чтобы не повисать при ошибках
				newAbsEl.recv = make(chan *Message, 1)
				newAbsEl.Handle("test", handler)
				newAbsEl.Run()
				waitForMillisecond()

				msg := &Message{Type:"test"}
				newAbsEl.GetRecv() <- msg

				waitForMillisecond()
				Expect(catched).Should(Equal(1))
			})

			It("Запускаем Run(), посылаем сообщение другого типа, ждем, что все будет в порядке", func(){
				newAbsEl.recv = make(chan *Message, 1)
				newAbsEl.Handle("test", handler)
				newAbsEl.Run()
				waitForMillisecond()
				msg := &Message{Type:"test2"}
				newAbsEl.GetRecv() <- msg
				waitForMillisecond()
				Expect(catched).Should(Equal(0))
			})

			It("Проверяем что можно добавить клиента",func(){
				rc := &remoteClient{}
				Expect(len(newAbsEl.clients)).Should(Equal(0))
				newAbsEl.Run()
				waitForMillisecond()
				err := newAbsEl.SubscribeClient(rc)
				Expect(err).Should(BeNil())
				waitForMillisecond()
				Expect(len(newAbsEl.clients)).Should(Equal(1))
				Expect(newAbsEl.clients[rc]).Should(BeTrue())

			})

			It("Проверяем, что можно добавить и удалить нормального клиента", func(){
				rc := &remoteClient{}
				Expect(len(newAbsEl.clients)).Should(Equal(0))
				newAbsEl.Run()
				waitForMillisecond()
				newAbsEl.SubscribeClient(rc)
				waitForMillisecond()
				err := newAbsEl.UnsubscribeClient(rc)
				Expect(err).Should(BeNil())
				waitForMillisecond()
				Expect(len(newAbsEl.clients)).Should(Equal(0))

			})

			It("Проверяем, что нельзя добавить пустого клиента", func(){
				var rc *remoteClient
				newAbsEl.Run()
				waitForMillisecond()
				err := newAbsEl.SubscribeClient(rc)
				Expect(err).ShouldNot(BeNil())
				Expect(err).Should(Equal(ErrElementClientIsNull))
			})

			It("Проверяем, что нельзя удалить пустого клиента", func(){
				var rc *remoteClient
				newAbsEl.Run()
				waitForMillisecond()
				err := newAbsEl.UnsubscribeClient(rc)
				Expect(err).ShouldNot(BeNil())
				Expect(err).Should(Equal(ErrElementClientIsNull))
			})

		})

		Context("Проверка Goroutines в работе", func() {
			var newAbsEl *AbstractElement

			BeforeEach(func() {
				newAbsEl = NewAbstractElement()
			})

			AfterEach(func() {
				newAbsEl.Quit()
			})

			It("Можно зарегестрировать канал quit для goroutine", func(){
				chName := make(chan bool)
				newAbsEl.RegisterQuitChannel(chName)
			})

			XIt("Нужно добавть тесты", func(){

			})


		})

	})
})
