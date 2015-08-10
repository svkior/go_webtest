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
	http.Handle("/assets/", http.StripPrefix("/assets", http.FileServer(http.Dir("./assets"))))
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
		fileconfigurator.NewFileConfig("test.json"),
	)
	// Запускаем конфигуратор на выполнение
	device.SendMessage(element.GetEmptyMessage("load", true))

	// Запускаем FileWatcher
	fw := filewatcher.NewFileWatcher("./assets/main.js")
	device.AddElement(fw)

	// Уходим в главный цикл программы

	go NewRestInterface(device)

	device.Wait()
	log.Println("Quit()")
}
