package internal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type ResponseShardeum struct {
	JSONRPC string
	Id      int
	Result  struct {
		Hash string
	}
}

func GetShardeumHash() (*BlockHash, error) {
	var response ResponseShardeum
	data := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "eth_getBlockByNumber",
		"params": []interface{}{
			"latest",
			false,
		},
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return nil, err
	}

	resp, err := http.Post(
		"https://api.shardeum.org/",
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
	log.Printf("Shardeum hash")
	return &BlockHash{
		SourceName:   "Shardeum",
		OriginalHash: response.Result.Hash,
		ModifiedHash: response.Result.Hash[2:],
	}, nil
}
