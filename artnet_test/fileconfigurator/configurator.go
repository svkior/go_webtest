package fileconfigurator
import (
  "bitbucket.org/tts/go_webtest/artnet_test/element"
  "log"
  "time"
  "os"
  "io/ioutil"
  "encoding/json"
)


/*
  Основан на файловой конфигурации элементов.
  Модуль загружается первым в Device, читает конфигурацию, загружает все остальные модули

 */

type FileConfig struct {
  element.AbstractElement
  ConfigFileName string
  ticker *time.Ticker
  // LastDate
  LastDate time.Time
  // Хранилище Конфигов
  Configs map[string]interface{}
}

func (e *FileConfig) getLasTime() (time.Time, error) {
  info, err := os.Stat(e.ConfigFileName)
  if err != nil {
    return time.Now(), err
  } else {
    return info.ModTime(), nil
  }
}



func (fc *FileConfig) LoadConfiguration(msg *element.Message) (bool, error){
  log.Println("Got Load Configuration")
  fc.ticker = time.NewTicker(1 * time.Second)
  quit := make(chan bool)
  fc.RegisterQuitChannel(quit)

  go func() {
    for {
      select {
      case <- fc.ticker.C:
        //log.Println("Check config existing")
        curDate, err := fc.getLasTime()
        if err != nil {
          // TODO: Нужно здесь создать конфигурацию
        } else {
          if curDate != fc.LastDate{
            log.Printf("Cur Data: %#v", curDate)
            fc.LastDate = curDate
            loadConfig, err := ioutil.ReadFile(fc.ConfigFileName)
            if err != nil {
              log.Println(err.Error())
              break
            }
            // Удаляем все старые конфигурации
            for k := range fc.Configs {
              delete(fc.Configs, k)
            }
            err = json.Unmarshal(loadConfig, &fc.Configs)
            if err == nil {
              log.Println("I Can Send Config to modules!!!!!")
              for name, conf := range fc.Configs{
                log.Printf("Config for %s", name)
                log.Printf("  Cont: %v", conf)
                // FIXME: здесь нужно передать конфигурацию для модулей
              }
              msg := element.GetEmptyMessage("ping", false, fc.GetName())
              msg.Payload = fc.Configs
              fc.SendToSubscribers(msg)
            } else {
              log.Println(err.Error())
            }
          }
        }
      case <- quit:
        log.Println("File Configurator: Stop")
        fc.ticker.Stop()
        return
      }
    }
  }()
  return true, nil
}

func (fc *FileConfig) SendConfigTo(name string) {
  msg := element.GetEmptyMessage("ping", false, fc.GetName())
  msg.Payload = fc.Configs
  fc.SendToClientByName(name, msg)
}

// Если кто-нибудь подписывается на fileconfigurator, то обратно нужно отдать
// конфиг
func (fc *FileConfig) OnSubscribed(msg *element.Message) (bool, error) {
  log.Printf("FileConfigurator: Got OnSubscribed %#v", msg)
  fc.SendConfigTo(msg.Name)
  return true, nil
}

func NewFileConfig(modName string, fileName string) *FileConfig{
  fConf := &FileConfig{
    AbstractElement: *element.NewAbstractElement(modName),
    ConfigFileName: fileName,
    Configs: make(map [string]interface{}),
  }
  fConf.Handle("load", fConf.LoadConfiguration)
  fConf.Handle("subscribed", fConf.OnSubscribed)
  return fConf
}