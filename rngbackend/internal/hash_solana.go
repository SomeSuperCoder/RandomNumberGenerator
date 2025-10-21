package internal

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type GetLatestBlockhashResponse struct {
	JSONRPC string
	Result  struct {
		Value struct {
			Blockhash string
		}
	}
}

func ExtraHash(data string) string {
	h := sha256.New()
	h.Write([]byte(data))
	hashSum := h.Sum(nil)
	hexHash := hex.EncodeToString(hashSum)
	return hexHash
}

func GetSolanaHash() string {
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
	return ExtraHash(response.Result.Value.Blockhash)
}
