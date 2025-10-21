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

func GetShardeumHash() string {
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
		return "1"
	}

	resp, err := http.Post(
		"https://api.shardeum.org/",
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
	log.Printf("Shardeum hash")
	return response.Result.Hash[2:]

}
