package auth

import (
	"errors"
)

type ValidationError error

var (
	errNoUsername          = ValidationError(errors.New("You must supply a username"))
	errNoEmail             = ValidationError(errors.New("You must supply an email"))
	errNoPassword          = ValidationError(errors.New("You must supply a password"))
	errPasswordTooShort    = ValidationError(errors.New("Your password is too short"))
	errUsernameExists      = ValidationError(errors.New("That username is taken"))
	errEmailExists         = ValidationError(errors.New("That email address has an account"))
	errCredintalsIncorrent = ValidationError(errors.New("We couldn`t find a user with the supplied username and password combination"))
	errPasswordIncorrect   = ValidationError(errors.New("Password did not match"))
)

func IsValidationError(err error) bool {
	_, ok := err.(ValidationError)
	return ok
}
