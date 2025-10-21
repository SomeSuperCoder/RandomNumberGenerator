package internal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ResponseInjective struct {
	JSONRPC string `json:"jsonrpc"`
	ID      int    `json:"id"`
	Result  struct {
		BlockID struct {
			Hash string `json:"hash"`
		} `json:"block_id"`
	} `json:"result"`
}

func GetInjectiveHash() string {
	var response ResponseInjective
	data := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "block",
		"params":  map[string]interface{}{},
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return "1"
	}

	resp, err := http.Post(
		"https://tm.injective.network/",
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

	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return "4"
	}

	return response.Result.BlockID.Hash
}
