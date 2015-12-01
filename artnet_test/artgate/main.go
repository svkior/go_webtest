package main
import (
	"log"
	"bitbucket.org/tts/go_webtest/artnet_test/element"
	"bitbucket.org/tts/go_webtest/artnet_test/fileconfigurator"
	"time"
	"github.com/StephanDollberg/go-json-rest-middleware-jwt"
	"github.com/ant0ine/go-json-rest/rest"
	"net/http"

	"sync"
	"html/template"
	"path/filepath"
	"os"
	"bitbucket.org/tts/go_webtest/artnet_test/trace"
	"bitbucket.org/tts/go_webtest/artnet_test/filewatcher"
	"bitbucket.org/tts/go_webtest/artnet_test/auth"
	"bitbucket.org/tts/go_webtest/artnet_test/mapp"
	"bitbucket.org/tts/go_webtest/artnet_test/ticker"
)


type templateHandler struct {
	once sync.Once
	filename string
	templ *template.Template
}

func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request){
	t.once.Do(func(){
		t.templ = template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
	})
	t.templ.Execute(w, nil)
}


func NewRestInterface(device *element.Device){
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

	router, err := rest.MakeRouter(
		rest.Post("/login", jwt_middleware.LoginHandler),
		rest.Get("/refresh_token", jwt_middleware.RefreshHandler),
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)
	http.Handle("/build/", http.StripPrefix("/build", http.FileServer(http.Dir("./build"))))
	http.Handle("/", &templateHandler{filename:"main.html"})
	http.Handle("/device", device)

	log.Fatal(http.ListenAndServe(":8080", nil))
}


func main(){
	log.Println("*** Starting Device ***")
	// Создаем новое устройство
	device := element.NewDevice()
	device.Tracer = trace.New(os.Stdout)

	// Запускаем на выполнение
	device.Run()
	// Добавляем конфигуратор

	device.AddElement(
		fileconfigurator.NewFileConfig("config","test.json"),
	)

	// Запускаем конфигуратор на выполнение
	device.SendMessage(element.GetEmptyMessage("load", true, "main"))

	// Запускаем FileWatcher
	device.AddElement(filewatcher.NewFileWatcher("./build/artgate.js"))

	//Запускаем Ticker
	device.AddElement(ticker.NewTicker("ticker", 1 * time.Second))

	device.AddElement(mapp.NewMap("artgate"))

	// Запускаем AuthService
	device.AddElement(auth.NewAuth("hello, world"))

	// Уходим в главный цикл программы
	go NewRestInterface(device)

	device.Wait()
	log.Println("Quit()")
}
