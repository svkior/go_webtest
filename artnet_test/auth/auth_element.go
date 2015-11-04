package auth
import (
	"bitbucket.org/tts/go_webtest/artnet_test/element"
	"log"
)

func NewAuth(secret string) element.Element{
	a := authService{
		AbstractElement: *element.NewAbstractElement("auth"),
	}
	a.Handle("login", a.ProcessAuth)
	a.Handle("logout", a.ProcessLogout)
	a.Handle("restore", a.ProcessRestore)
	return &a
}

type authService struct {
	element.AbstractElement
	sessionID string
}

func (a *authService) GetName() string {
	return "auth"
}

type authPayload struct {
	login string
	password string
}

func (a *authService) ProcessRestore(msg *element.Message) (bool, error){
	outMsg := element.GetEmptyMessage("response", false, a.GetName())
	var sessID string
	sessID = msg.Payload.(map[string]interface{})["session"].(string)
	sess := RequestSession(sessID)
	outMsg.Name = "auth"
	if sess == nil {
		outMsg.Type = "authoff"
	} else {
		log.Println("User ID of old session: ", sess.UserID)
		outMsg.Type = "authok"
		f2 := make(map[string]string)
		f2["authentication"] = sess.ID
		a.sessionID = sess.ID
		outMsg.Payload = f2
	}
//	go func(){
		msg.Client.GetRecv() <- outMsg
//	}()
	//log.Println("DONE!!!")
	return true, nil
}

func (a *authService) ProcessLogout(msg *element.Message) (bool, error){
	sess, _ := golbalSessionStore.Find(a.sessionID)
	if sess != nil {
		golbalSessionStore.Delete(sess)
		a.sessionID = ""
	}
	outMsg := element.GetEmptyMessage("response", false, a.GetName())
	outMsg.Type = "authoff"
	msg.Client.GetRecv() <- outMsg
	return true, nil
}
/*
 При запросе авторизации
 Если клиент авторизовался, то клиенту присваивается соотвествующий уровень.
 все службы должны то же использовать нужный уровень допуска.

 */
func (a *authService) ProcessAuth(msg *element.Message) (bool, error){

	f := msg.Payload.(map[string]interface{})
	log.Printf("Process Authentication: Got %s, %s", f["login"], f["passwd"])

	outMsg := element.GetEmptyMessage("response", false, a.GetName())
	outMsg.Name = "auth"

	var f2 map[string]string

	f2 = make(map[string]string)
	var login string
	var passwd string

	login = f["login"].(string)
	passwd = f["passwd"].(string)

	user, err := FindUser(login, passwd)
	if err == nil{
		sess := NewSession()
		sess.UserID = user.ID
		golbalSessionStore.Save(sess)
		outMsg.Type = "authok"
		f2["authentication"] = sess.ID
		a.sessionID = sess.ID
	} else {
		outMsg.Type = "autherr"
		f2["authentication"] = ""
	}

	outMsg.Payload = f2
	msg.Client.GetRecv() <- outMsg
	return true, nil
}