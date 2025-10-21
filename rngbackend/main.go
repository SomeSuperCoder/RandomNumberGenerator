package main

import (
	"fmt"

	"github.com/SomeSuperCoder/RandomNumberGenerator/internal"
)

func main() {
	result := internal.Process([]string{"19716f2c3270a6671683037b907f1546", "a15261335c6c0a7c3bdaee031d0483b8", "17e8d5aa553365f9c1f451f7374fa260"})
	fmt.Println(result)
}
