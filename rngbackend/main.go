package main

import (
	"fmt"

	"github.com/SomeSuperCoder/RandomNumberGenerator/internal"
)

func main() {
	var hashes []string

	// Populate the array with hashes
	hashes = append(hashes, internal.GetSolanaHash())

	result := internal.Process(hashes)

	fmt.Println(result)
}
