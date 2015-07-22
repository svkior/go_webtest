package artnet_test

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"bitbucket.org/tts/go-webserver"
)


func StubForNotFound(w http.ResponseWriter, r *http.Request) {

}

func NewApp() webserver.Middleware {

	router := httprouter.New()
	router.Handle("GET", "/", HandleHome)

	router.ServeFiles("/assets/*filepath", http.Dir("assets/"))
	router.Handle("GET", "/login", webserver.HandleSessionNew)
	router.Handle("POST", "/login", webserver.HandleSessionCreate)
	router.Handle("GET", "/user/:userID", webserver.HandleUserShow)
	router.NotFound = http.HandlerFunc(StubForNotFound)

	secureRouter := httprouter.New()

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