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
			dut.quit = make(chan bool, 5)
			dut.Run()
			waitForMillisecond()
		})

		AfterEach(func(){
			dut.Stop()
			waitForMillisecond()
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

	})

})
