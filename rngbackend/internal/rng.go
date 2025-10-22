package internal

import (
	"math"
	"math/rand"
	"strconv"
	"time"
)

type BlockHash struct {
	SourceName   string `json:"source_name"`
	OriginalHash string `json:"original_hash"`
	ModifiedHash string `json:"modified_hash"`
}

func AsStringArray(blockHashes []BlockHash) []string {
	var result []string

	for _, blockHash := range blockHashes {
		result = append(result, blockHash.ModifiedHash)
	}

	return result
}

type VerifycationData struct {
	Hashes  []BlockHash `json:"hashes"`
	XFactor int64       `json:"x_factor"`
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

func NewRng() (*rand.Rand, int64) {
	now := time.Now().UnixNano()
	return rand.New(rand.NewSource(now)), now
}

// This is a wrapper function
// Generate random numbers squence based upon a single timestamp
func ProcessSeq(hashesFull []BlockHash, amount int, binary bool, fullRandom bool) []*FinalData {
	var response = make([]*FinalData, amount)

	rng, unixTime := NewRng()
	for i := range response {
		if fullRandom {
			rng, unixTime = NewRng()
		}
		value := Process(hashesFull, binary, unixTime, rng)
		response[i] = value
	}

	return response
}

// Generate a single random number
func Process(hashesFull []BlockHash, binary bool, unixTime int64, rng *rand.Rand) *FinalData {
	var pipeline = &Pipeline{}

	hashes := AsStringArray(hashesFull)

	pipeline.Split = Split(hashes)
	pipeline.Pick = Pick(pipeline.Split, rng)
	pipeline.Convert = Convert(pipeline.Pick)
	pipeline.Sum = Sum(pipeline.Convert)
	pipeline.Result = Result(pipeline.Sum, binary)

	return &FinalData{
		Pipeline: *pipeline,
		VerifycationData: VerifycationData{
			Hashes:  hashesFull,
			XFactor: unixTime,
		},
	}
}

// Splits a string into fixed chuncks
func splitIntoChunks(s string, chunkSize int) []string {
	var chunks []string
	for i := 0; i < len(s); i += chunkSize {
		end := min(i+chunkSize, len(s))
		chunks = append(chunks, s[i:end])
	}
	return chunks
}

// Splits the given hashes into pieces
func Split(hashes []string) [][]string {
	var result [][]string

	for _, hash := range hashes {
		parts := splitIntoChunks(hash, step)
		result = append(result, parts)
	}

	return result
}

// Picks random hash parts based upon the time
func Pick(hashes [][]string, rng *rand.Rand) []string {
	var result = make([]string, len(hashes))

	for i, options := range hashes {
		randomIndex := rng.Intn(len(options))
		randomElement := options[randomIndex]
		result[i] = randomElement
	}

	return result
}

// Converts hex to decimal
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

// Does +- operation on the given decimal numbers
func Sum(sums []uint64) uint64 {
	var result uint64

	for i, value := range sums {
		if i%2 == 0 {
			result = result + value
		} else {
			result = result - value
		}
	}

	return uint64(math.Abs(float64(result)))
}

// Converts a big number to a range between 0 and 1 or to a binary number
func Result(num uint64, binary bool) float64 {
	if binary {
		return float64(num % 2)
	}

	return float64(num%k+1) / k
}
