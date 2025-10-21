package internal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

type Pipeline struct {
	Hashes  []string   `json:"hashes"`
	Split   [][]string `json:"split"`
	Pick    []string   `json:"pick"`
	Convert []uint64   `json:"convert"`
	Sum     uint64     `json:"sum"`
	Result  float64    `json:"result"`
}

// Salana response structure
type GetLatestBlockhashResponse struct {
	JSONRPC string
	Result  struct {
		Value struct {
			Blockhash string
		}
	}
}

const k = 1000
const step = 5

func GetSalanaHash() string {
	var response GetLatestBlockhashResponse
	data := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "getLatestBlockhash",
		"params": []interface{}{
			map[string]interface{}{
				"commitment": "processedzed",
			},
		},
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return "1"
	}

	resp, err := http.Post(
		"https://api.devnet.solana.com",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		fmt.Println("Error making request:", err)
		return "2"
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return "3"
	}
	err = json.Unmarshal([]byte(string(body)), &response)

	if err != nil {
		log.Fatal("Error parsing JSON:", err)
	}
	return response.Result.Value.Blockhash

}

func Process(hashes []string) float64 {
	return Result(
		Sum(
			Convert(
				Pick(
					Split(
						hashes,
					),
				),
			),
		),
	)
}

func splitIntoChunks(s string, chunkSize int) []string {
	var chunks []string
	for i := 0; i < len(s); i += chunkSize {
		end := min(i+chunkSize, len(s))
		chunks = append(chunks, s[i:end])
	}
	return chunks
}

func Split(hashes []string) [][]string {
	var result [][]string

	for _, hash := range hashes {
		parts := splitIntoChunks(hash, step)
		result = append(result, parts)
	}

	return result
}

func Pick(hashes [][]string) []string {
	var result = make([]string, len(hashes))
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	for i, options := range hashes {
		randomIndex := rng.Intn(len(options))
		randomElement := options[randomIndex]
		result[i] = randomElement
	}

	return result
}

func Convert(parts []string) []uint64 {
	var result = make([]uint64, len(parts))

	for i, value := range parts {
		num, err := strconv.ParseUint(value, 16, 64)
		if err != nil {
			panic(err)
		}

		result[i] = num
	}

	return result
}

func Sum(sums []uint64) uint64 {
	var result uint64

	for i, value := range sums {
		if i%2 == 0 {
			result = result + value
		} else {
			result = result - value
		}
	}

	return result
}

func Result(num uint64) float64 {
	var extra float64 = 0
	if rand.Intn(2) == 1 {
		extra = 0.001
	}

	return float64(num%k)/k + extra
}
