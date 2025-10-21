package internal

import (
	"math/rand"
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

const k = 1000
const step = 5

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
