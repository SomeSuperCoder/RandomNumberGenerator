package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	nistwrapper "github.com/SomeSuperCoder/RandomNumberGenerator/internal/nist_wrapper"
	"github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"
	"github.com/SomeSuperCoder/RandomNumberGenerator/utils"
)

func IntAuditor(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if utils.CheckError(w, err, "Failed to read the request body", http.StatusBadRequest) {
		return
	}
	defer r.Body.Close()

	var intArray []int
	err = json.Unmarshal(body, &intArray)
	if utils.CheckJSONError(w, err) {
		return
	}

	bitArray := nist80022.IntArrayToBitArray(intArray)

	// ##### DO THE ACTUAL TESTS #####
	result := nistwrapper.RunTests(bitArray, nistwrapper.TestList)
	resultMarshaled, err := json.Marshal(result)
	if utils.CheckError(w, err, "Failed to Marshal JSON", http.StatusInternalServerError) {
		return
	}

	fmt.Fprintln(w, string(resultMarshaled))
}
