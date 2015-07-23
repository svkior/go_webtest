package element
import "time"

type Message struct {
	Broadcast bool `json:"broadcast"`
	Type string `json:"type"`
	Name string `json:"name"`
	When time.Time `json:"when"`
	Payload interface{} `json:"payload"`
}

func GetEmptyMessage(mType string, broadcast bool) *Message{
	m := Message{
		Broadcast: broadcast,
		Type: mType,
		Name: "unicast",
		When: time.Now(),
		Payload: nil,
	}
	return &m
}