package artnet_test

import (
	"net/http"
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"golang.org/x/net/websocket"
	"io"
	"sync"
	"bitbucket.org/tts/light_dmx_go/ethconfig"
)

func wsFunc(ws *websocket.Conn){
	io.Copy(ws, ws)
}

var lock = sync.RWMutex{}

func getAllStatus(w rest.ResponseWriter, r *rest.Request){
	lock.RLock()
	w.WriteJson(globalSetup)
	lock.RUnlock()
}

func setupEthernet(w rest.ResponseWriter, r *rest.Request){
	eth := ethconfig.EthSetup{}
	err := r.DecodeJsonPayload(&eth)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if eth.IpAddress == "" {
		rest.Error(w, "IpAddress required", 400)
		return
	}

	lock.Lock()
	globalSetup.Eth.IpAddress = eth.IpAddress
	globalSetup.Eth.IpMask = eth.IpMask
	globalSetup.Eth.IpGw = eth.IpGw
	globalSetup.Eth.Mac = eth.Mac
	lock.Unlock()
	getAllStatus(w, r)
}


func NewRestInterface(){
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)

	wsHandler := websocket.Handler(wsFunc)

	router, err := rest.MakeRouter(
		rest.Get("/status", getAllStatus),
		rest.Post("/setup/ethernet", setupEthernet),
		rest.Get("/message", func(w rest.ResponseWriter, req *rest.Request){
			w.WriteJson(map[string]string{"body":"Hello, World!"})
		}),
		rest.Get("/ws", func(w rest.ResponseWriter, r *rest.Request){
			wsHandler.ServeHTTP(w.(http.ResponseWriter), r.Request)
		}),
	)
	if err != nil {
		log.Fatal(err)
	}

	api.SetApp(router)

	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.Handle("/assets/", http.StripPrefix("/assets", http.FileServer(http.Dir("./assets"))))
	http.Handle("/", &templateHandler{filename:"main.html"})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
