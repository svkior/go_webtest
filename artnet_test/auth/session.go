package auth

import (
	"time"
)

type Session struct {
	ID     string
	UserID string
	Expiry time.Time
}

const (
	sessionLength     = 24 * 3 * time.Hour
	sessionCookieName = "GophrSession"
	sessionIDLength   = 20
)

func NewSession() *Session {
	expiry := time.Now().Add(sessionLength)

	session := &Session{
		ID:     GenerateID("sess", sessionIDLength),
		Expiry: expiry,
	}

	return session
}

func (session *Session) Expired() bool {
	return session.Expiry.Before(time.Now())
}

func RequestSession(sessionID string) *Session {

	session, err := golbalSessionStore.Find(sessionID)
	if err != nil {
		panic(err)
	}

	if session == nil {
		return nil
	}

	if session.Expired() {
		golbalSessionStore.Delete(session)
		return nil
	}

	return session
}

func RequestUser(sessionID string) *User {
	session := RequestSession(sessionID)
	if session == nil || session.UserID == "" {
		return nil
	}

	user, err := globalUserStore.Find(session.UserID)
	if err != nil {
		panic(err)
	}
	return user
}


func FindOrCreateSession(sessionID string) *Session {
	session := RequestSession(sessionID)
	if session == nil {
		session = NewSession()
	}
	return session
}
