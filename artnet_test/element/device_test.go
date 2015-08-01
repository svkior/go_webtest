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

		XIt("Проверить, что невозможно повторно запустить Device", func(){
			Expect(dut.running).Should(BeTrue())
			err := dut.Run()
			Expect(err).ShouldNot(BeNil())
			Expect(err).Should(Equal(ErrElementDeviceIsAlreadyRan))
		})

		XIt("Проверить что можно добавить элемент к Device", func(){
			Expect(len(dut.clients)).Should(Equal(0))
			dut.join <- &AbstractElement{}
			waitForMillisecond()
			Expect(len(dut.clients)).Should(Equal(1))
		})

		XIt("Можно удалять клиентов из Device", func(){
			Expect(len(dut.clients)).Should(Equal(0))
			ae := &AbstractElement{}
			dut.join <- ae
			waitForMillisecond()
			dut.leave <- ae
			waitForMillisecond()
			Expect(len(dut.clients)).Should(Equal(0))
		})

		XIt("При добавлении клиента Device прописывается в клиенте как ссылка", func(){
			ae := &AbstractElement{}
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.device).Should(BeEquivalentTo(dut))
		})

		XIt("При добавлении клиента в Device клиент запускается", func(){
			ae := NewAbstractElement()
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeTrue())
		})

		XIt("При удалении клиента он должен останавливаться", func(){
			ae := NewAbstractElement()
			Expect(ae.running).Should(BeFalse())
			dut.join <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeTrue())
			dut.leave <- ae
			waitForMillisecond()
			Expect(ae.running).Should(BeFalse())
		})


	})

})
