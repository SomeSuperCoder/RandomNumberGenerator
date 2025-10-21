package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/SomeSuperCoder/RandomNumberGenerator/internal"
	"github.com/SomeSuperCoder/RandomNumberGenerator/utils"
)

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

	// Do work
	// // Load hashes
	var hashes = []string{
		internal.GetSolanaHash(),
		internal.GetShardeumHash(),
		internal.GetInjectiveHash(),
	}

	// // Form a response
	var response = make([]float64, amountParsed)
	for i := range response {
		value := internal.Process(hashes)
		response[i] = value
	}

	result, err := json.Marshal(response)
	if utils.CheckError(w, err, "Failed to form a response", http.StatusInternalServerError) {
		return
	}

	fmt.Fprintln(w, string(result))
}
