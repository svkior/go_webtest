package artnet_test

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"bitbucket.org/tts/go-webserver"
)

func HandleHome(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
/*	images, err := globalImageStore.FindAll(0)
	if err != nil {
		panic(err)
	}
*/
	webserver.RenderTemplate(w, r, "index/home", map[string]interface{}{
		"Setup": globalSetup,
	})
}
