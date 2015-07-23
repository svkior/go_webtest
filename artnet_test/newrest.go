package artnet_test

import (
	"net/http"
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"golang.org/x/net/websocket"
	"io"
	"sync"
	"bitbucket.org/tts/light_dmx_go/ethconfig"
	"github.com/StephanDollberg/go-json-rest-middleware-jwt"
	"time"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
	"os"
	"bitbucket.org/tts/go_webtest/artnet_test/element"
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

func setupArtIn(w rest.ResponseWriter, r *rest.Request){
	artIns := []*ArtIn{}
	err := r.DecodeJsonPayload(&artIns)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lock.Lock()
	globalSetup.ArtIns = nil
	globalSetup.ArtIns = artIns
	globalSetup.ArtnetInputs = len(artIns)
	lock.Unlock()
	getAllStatus(w, r)
}


func setupArtOut(w rest.ResponseWriter, r *rest.Request){
	artOuts := []*ArtOut{}
	err := r.DecodeJsonPayload(&artOuts)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	lock.Lock()
	globalSetup.ArtOuts = nil
	globalSetup.ArtOuts = artOuts
	globalSetup.ArtnetOutputs = len(artOuts)
	lock.Unlock()
	getAllStatus(w, r)
}

func handle_auth(w rest.ResponseWriter, r *rest.Request) {
	w.WriteJson(map[string]string{"authed": r.Env["REMOTE_USER"].(string)})
}


func NewRestInterface(){

	d := element.NewDevice()
	d.Tracer = trace.New(os.Stdout)
	go d.Run()

	fwe := element.NewFileWatcher("./assets/build/wsmain.js")

	ticker := element.NewTicker(1 * time.Second)

	jwt_middleware := &jwt.JWTMiddleware{
		Key:        []byte("secret key"),
		Realm:      "jwt auth",
		Timeout:    time.Hour,
		MaxRefresh: time.Hour * 24,
		Authenticator: func(userId string, password string) bool {
			return userId == "admin" && password == "admin"
		}}
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)

	api.Use(&rest.IfMiddleware{
		Condition: func(request *rest.Request) bool {
			return request.URL.Path != "/login"
		},
		IfTrue: jwt_middleware,
	})

	wsHandler := websocket.Handler(wsFunc)

	router, err := rest.MakeRouter(
		rest.Post("/login", jwt_middleware.LoginHandler),
		rest.Get("/refresh_token", jwt_middleware.RefreshHandler),
		rest.Get("/status", getAllStatus),
		rest.Post("/setup/ethernet", setupEthernet),
		rest.Post("/setup/artin", setupArtIn),
		rest.Post("/setup/artout", setupArtOut),
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
	http.Handle("/wsinterface", &templateHandler{filename:"wsint.html"})

	http.Handle("/device", d)
	go d.AddElement(fwe)
	go d.AddElement(ticker)

	http.Handle("/", &templateHandler{filename:"main.html"})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
