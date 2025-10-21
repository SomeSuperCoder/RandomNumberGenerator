package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"

	"github.com/SomeSuperCoder/RandomNumberGenerator/internal"
	"github.com/SomeSuperCoder/RandomNumberGenerator/utils"
)

func RunAsync[T any](values *[]T, mutex *sync.Mutex, wg *sync.WaitGroup, f func() T) {
	defer wg.Done()
	res := f()
	mutex.Lock()
	defer mutex.Unlock()
	*values = append(*values, res)
}

func GetRandomNumbers(w http.ResponseWriter, r *http.Request) {
	// Parse
	amount := r.URL.Query().Get("amount")
	if amount == "" {
		amount = "1"
	}
	amountParsed, err := strconv.Atoi(amount)
	if utils.CheckError(w, err, "Invalid amount number provided", http.StatusBadRequest) {
		return
	}

	var hashes = []string{}
	var hashesMutex sync.Mutex
	var hashesWG sync.WaitGroup
	hashesWG.Add(2)

	// Do work
	// // Load hashes
	go RunAsync(&hashes, &hashesMutex, &hashesWG, internal.GetSolanaHash)
	go RunAsync(&hashes, &hashesMutex, &hashesWG, internal.GetShardeumHash)
	// go RunAsync(&hashes, &hashesMutex, &hashesWG, internal.GetInjectiveHash)

	hashesWG.Wait()

	// // Form a response
	var response = make([]*internal.Pipeline, amountParsed)
	for i := range response {
		value := internal.Process(hashes)
		response[i] = value
	}

	// Respond
	result, err := json.Marshal(response)
	if utils.CheckError(w, err, "Failed to form a response", http.StatusInternalServerError) {
		return
	}

	fmt.Fprintln(w, string(result))
}
