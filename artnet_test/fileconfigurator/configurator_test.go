package fileconfigurator_test

import (
	. "bitbucket.org/tts/go_webtest/artnet_test/fileconfigurator"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Configurator", func() {
		Context("Проверка базовых действий конфигуратора", func(){


			It("Проверяем, что Есть ConfigFileName ", func(){
				fc := NewFileConfig("test.conf")
				Expect(fc.ConfigFileName).Should(Equal("test.conf"))
			})

			It("Проверяем, что элемент отзывается на GetName", func(){
				fc := NewFileConfig("test.conf")
				Expect(fc.GetName()).Should(Equal("config"))
			})


		})
})
