package internal

import (
	"math/rand"
	"strconv"
	"time"
)

type BlockHash struct {
	SourceName string `json:"source_name"`
	Hash       string `json:"hash"`
}

type VerifycationData struct {
	Hashes  []string `json:"hashes"`
	XFactor int64    `json:"x_factor"`
}

type Pipeline struct {
	Split   [][]string `json:"split"`
	Pick    []string   `json:"pick"`
	Convert []uint64   `json:"convert"`
	Sum     uint64     `json:"sum"`
	Result  float64    `json:"result"`
}

type FinalData struct {
	VerifycationData
	Pipeline
}

const k = 1000
const step = 5

func Process(hashes []string, binary bool) *FinalData {
	var pipeline = &Pipeline{}
	unixTime := time.Now().UnixNano()

	pipeline.Split = Split(hashes)
	pipeline.Pick = Pick(pipeline.Split, unixTime)
	pipeline.Convert = Convert(pipeline.Pick)
	pipeline.Sum = Sum(pipeline.Convert)
	pipeline.Result = Result(pipeline.Sum, binary)

	return &FinalData{
		Pipeline: *pipeline,
		VerifycationData: VerifycationData{
			Hashes:  hashes,
			XFactor: unixTime,
		},
	}
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

func Pick(hashes [][]string, xFactor int64) []string {
	var result = make([]string, len(hashes))
	rng := rand.New(rand.NewSource(xFactor))

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

func Result(num uint64, binary bool) float64 {
	if binary {
		return float64(num % 2)
	}

	return float64(num%k+1) / k
}
