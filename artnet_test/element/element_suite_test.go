package element

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"testing"
)

func TestElement(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Element Suite")
}
