package artnet_test
import (
	"errors"
	"bitbucket.org/tts/go-webserver"
)


var (
	errInvalidIP		   = webserver.ValidationError(errors.New("Некорректный IP адрес"))
	errInvalidMask         = webserver.ValidationError(errors.New("Некорректная IP маска"))
	errInvalidGw           = webserver.ValidationError(errors.New("Некорректный Шлюз"))
	errInvalidMAC          = webserver.ValidationError(errors.New("Некорректный MAC адрес"))
	errInvalidArtnetInputs = webserver.ValidationError(errors.New("Некорректное значение числа входов ArtNet"))
	errInvalidArtnetOutputs= webserver.ValidationError(errors.New("Некорректное значение числа выходов ArtNet"))
	errInvalidUniverse     = webserver.ValidationError(errors.New("Неправильный номер вселенной"))
)
