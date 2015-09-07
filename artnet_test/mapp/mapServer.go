package mapp

import (
	"bitbucket.org/tts/go_webtest/artnet_test/element"
)

func NewMap(mapName string) element.Element{
	m := mapConfig{
		AbstractElement: *element.NewAbstractElement("map"),
		devices: make(map[string]string),
		links: make(map[string]string),
	}
	return &m
}

type mapConfig struct {
	element.AbstractElement
	devices map[string]string
	links map[string]string
}