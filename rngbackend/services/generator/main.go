package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	url := "http://localhost:8090/rng?amount=1000&binary=true"
	var builder strings.Builder

	for i := range 1000 {
		resp, err := http.Get(url)
		if err != nil {
			log.Fatalf("Error making GET request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			log.Fatalf("Unexpected status code: %d %s", resp.StatusCode, resp.Status)
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatalf("Error reading response body: %v", err)
		}

		builder.WriteString(string(body))
		log.Printf("Finished request №%v\n", i)
	}

	err := os.WriteFile("output.bin", []byte(builder.String()), 0644)
	if err != nil {
		log.Fatalf("Error writing to file: %v", err)
	}

	log.Printf("Successfully wrote the file")
}
