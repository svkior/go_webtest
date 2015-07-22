package artnet_test
import "time"

type message struct {
	Name string
	Message string
	When time.Time
}