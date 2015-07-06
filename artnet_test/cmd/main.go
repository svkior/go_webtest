package main
import (
	"log"
	"net/http"
	"bitbucket.org/tts/go_webtest/artnet_test"
)


func main() {
	log.Fatal(http.ListenAndServe(":3000", artnet_test.NewApp()))
}