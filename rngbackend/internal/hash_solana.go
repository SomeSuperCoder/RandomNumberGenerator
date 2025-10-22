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

type ResponseSolana struct {
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

func GetSolanaHash() (*BlockHash, error) {
	var response ResponseSolana
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
		return nil, err
	}

	resp, err := http.Post(
		"https://api.devnet.solana.com",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		fmt.Println("Error making request:", err)
		return nil, err

	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return nil, err

	}
	err = json.Unmarshal([]byte(string(body)), &response)

	if err != nil {
		log.Fatal("Error parsing JSON:", err)
	}
	log.Printf("Solana hash")
	return &BlockHash{
		SourceName:   "Shardeum",
		OriginalHash: response.Result.Value.Blockhash,
		ModifiedHash: ExtraHash(response.Result.Value.Blockhash),
	}, nil
}
