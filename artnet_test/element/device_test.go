package element

import (

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Device", func() {

	Context("Тестируем наличие у Device всех необходимых полей", func(){
		var dut *Device

		BeforeEach(func(){
			dut = &Device{}
		})

		It("Проверяем, что есть канал широковещательной рассылки forward", func(){
			var ch chan *Message
			Expect(dut.forward).Should(BeAssignableToTypeOf(ch))
		})

		It("Есть канал join для подключения элементов", func(){
			var chel chan Element
			Expect(dut.join).Should(BeAssignableToTypeOf(chel))
		})

		It("Есть канал leave для подключения элементов", func(){
			var chel chan Element
			Expect(dut.leave).Should(BeAssignableToTypeOf(chel))
		})

		It("Есть map clients для подключения элементов", func(){
			var mel map[Element]bool
			Expect(dut.clients).Should(BeAssignableToTypeOf(mel))
		})

	})


	Context("Тестируем старт Device", func(){
		var dut *Device

		BeforeEach(func(){
			dut = NewDevice()
			// Только для не повисания теста
			//dut.quit = make(chan bool, 5)
			dut.Run()
			waitForMillisecond()
		})

		AfterEach(func(){
			waitForMillisecond()
			dut.Stop()
		})

		It("При запуске проверить что Device is running", func(){
			Expect(dut.running).Should(BeTrue())
		})

		It("При останове проверить что Device is stopped", func(){
			dut.Stop()
			waitForMillisecond()
			Expect(dut.running).Should(BeFalse())
		})

		It("Проверить, что невозможно повторно запустить Device", func(){
			Expect(dut.running).Should(BeTrue())
			err := dut.Run()
			Expect(err).ShouldNot(BeNil())
			Expect(err).Should(Equal(ErrElementDeviceIsAlreadyRan))
		})

		It("Проверить что можно добавить элемент к Device", func(){
			Expect(len(dut.clients)).Should(Equal(0))
			dut.join <- &AbstractElement{}
			waitForMillisecond()
			Expect(len(dut.clients)).Should(Equal(1))
		})

		It("Можно удалять клиентов из Device", func(){
			Expect(len(dut.clients)).Should(Equal(0))
			ae := &AbstractElement{}
			dut.join <- ae
			waitForMillisecond()
			dut.leave <- ae
			waitForMillisecond()
			Expect(len(dut.clients)).Should(Equal(0))
		})

		It("При добавлении клиента Device прописывается в клиенте как ссылка", func(){
			ae := &AbstractElement{}
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.device).Should(BeEquivalentTo(dut))
		})

		It("При добавлении клиента в Device клиент запускается", func(){
			ae := NewAbstractElement()
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeTrue())
		})

		It("При удалении клиента он должен останавливаться", func(){
			ae := NewAbstractElement()
			Expect(ae.running).Should(BeFalse())
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeTrue())
			dut.leave <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeFalse())
		})

		It("Добавили клиента. При посыле в device->forward клиент получает это сообщение", func(){
			// Счетчик попадания сообщений
			count := 0
			// Хандлер для сообщений
			incHandler := func(msg *Message) (bool, error){
				count++
				return true,nil
			}
			ae := NewAbstractElement()
			// При посылки сообщения "test" мы ловим его хандлером incHandler
			ae.Handle("test", incHandler)
			dut.join <- ae
			waitForMillisecond()
			msg := GetEmptyMessage("test", true)
			dut.forward <- msg
			waitForMillisecond()
			Expect(count).Should(Equal(1))
		})

		It("Можно получить список клиентов", func(){
			// Я при подстоединении или вообще должен получить список элементов
			// С их адресами. Дабы подписаться. Или делать это сообщениями????
			ae1 := NewAbstractElement()
			ae2 := NewAbstractElement()
			dut.join <- ae1
			dut.join <- ae2
			waitForMillisecond()
			//ae1.device.
			Fail("Не реализовано")
		})

		XIt("Можно подписывать одного клиента на другого", func(){})

		XIt("Можно отписывать одного клиента на другого", func(){})

		XIt("При удалении одного клиента второй отписывается", func(){})

		XIt("Добавили двух клиентов, подписались одним клиентом на инфу из другого. Инфа пошла", func(){

		})

	})

})
