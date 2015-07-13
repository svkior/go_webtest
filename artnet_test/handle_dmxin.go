package artnet_test
import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"bitbucket.org/tts/go-webserver"
	"log"
)

func HandleDmxIn(w http.ResponseWriter, r *http.Request, _ httprouter.Params){
	webserver.RenderTemplate(w, r, "dmxin/view", map[string]interface{}{
		"Setup": globalSetup,
	})
}

func (r *room) HandleDmxInSocket(w http.ResponseWriter, req *http.Request, _ httprouter.Params){
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
		return
	}
	client := &wsClient{
		socket: socket,
		send: make(chan []byte, messageBufferSize),
		room: r,
	}
	r.join <- client
	defer func(){ r.leave <- client} ()

	go client.write()
	client.read()
}
