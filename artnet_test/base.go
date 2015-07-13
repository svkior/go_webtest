package artnet_test

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"bitbucket.org/tts/go-webserver"
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"golang.org/x/net/websocket"
	"io"
)


func StubForNotFound(w http.ResponseWriter, r *http.Request) {

}



func wsFunc(ws *websocket.Conn){
	io.Copy(ws, ws)
}


func NewRestInterface(){
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)

	wsHandler := websocket.Handler(wsFunc)

	router, err := rest.MakeRouter(
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


func NewApp() webserver.Middleware {
	r := NewRoom()

	router := httprouter.New()
	router.Handle("GET", "/", HandleHome)

	router.ServeFiles("/assets/*filepath", http.Dir("assets/"))
	router.Handle("GET", "/login", webserver.HandleSessionNew)
	router.Handle("POST", "/login", webserver.HandleSessionCreate)
	router.Handle("GET", "/user/:userID", webserver.HandleUserShow)
	router.NotFound = http.HandlerFunc(StubForNotFound)

	secureRouter := httprouter.New()

	secureRouter.Handle("GET", "/room", HandleDmxIn)
	secureRouter.Handle("GET", "/roomfeed", r.HandleDmxInSocket )

	secureRouter.Handle("GET",  "/sign-out", webserver.HandleSessionDestroy)
	secureRouter.Handle("GET",  "/account",  webserver.HandleUserEdit)
	secureRouter.Handle("POST", "/account",  webserver.HandleUserUpdate)

	secureRouter.Handle("GET",  "/setup-ip", HandleSetupEthEdit)
	secureRouter.Handle("POST", "/setup-ip", HandleSetupEthUpdate)

	secureRouter.Handle("GET",  "/setup-artnet", HandleSetupArtnetEdit)
	secureRouter.Handle("POST", "/setup-artnet", HandleSetupArtnetUpdate)

	secureRouter.Handle("GET",  "/setup-artnet-out", HandleSetupArtnetOutEdit)
	secureRouter.Handle("POST", "/setup-artnet-out", HandleSetupArtnetOutUpdate)

	middleware := webserver.Middleware{}
	middleware.Add(router)
	middleware.Add(http.HandlerFunc(webserver.RequireLogin))
	middleware.Add(secureRouter)

	return middleware
}