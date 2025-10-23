package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	nistwrapper "github.com/SomeSuperCoder/RandomNumberGenerator/internal/nist_wrapper"
	"github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"
	"github.com/SomeSuperCoder/RandomNumberGenerator/utils"
)

func binaryStringToBytes(binaryStr string) ([]byte, error) {
	// Calculate how many complete bytes we can make
	byteCount := len(binaryStr) / 8

	bytes := make([]byte, byteCount)

	for i := range byteCount {
		start := i * 8
		end := start + 8

		// Parse each 8-bit chunk
		val, err := strconv.ParseUint(binaryStr[start:end], 2, 8)
		if err != nil {
			return nil, fmt.Errorf("invalid binary at position %d-%d: %w", start, end, err)
		}
		bytes[i] = byte(val)
	}

	return bytes, nil
}

func BinaryAuditor(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if utils.CheckError(w, err, "Failed to read the request body", http.StatusBadRequest) {
		return
	}
	defer r.Body.Close()

	binaryStr := string(body)

	// Convert binary string to bytes
	bytes, err := binaryStringToBytes(binaryStr)
	if utils.CheckError(w, err, "Failed to convert the provided binary string to bytes", http.StatusBadRequest) {
		return
	}

	bitArray := nist80022.BitArray{
		Data: bytes,
	}

	// ##### DO THE ACTUAL TESTS #####
	result := nistwrapper.RunTests(&bitArray, nistwrapper.TestList)
	resultMarshaled, err := json.Marshal(result)
	if utils.CheckError(w, err, "Failed to Marshal JSON", http.StatusInternalServerError) {
		return
	}

	fmt.Fprintln(w, string(resultMarshaled))
}
