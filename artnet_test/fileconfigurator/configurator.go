package fileconfigurator
import "bitbucket.org/tts/go_webtest/artnet_test/element"


/*
  Основан на файловой конфигурации элементов.
  Модуль загружается первым в Device, читает конфигурацию, загружает все остальные модули

 */

type FileConfig struct {
  element.AbstractElement
  ConfigFileName string
}

func NewFileConfig(fileName string) *FileConfig{
  fСonf := &FileConfig{
    ConfigFileName: fileName,
  }
  return fСonf
}