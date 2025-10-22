package internal

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type ResponseEthereum struct {
	JSONRPC string `json:"jsonrpc"`
	ID      int    `json:"id"`
	Result  struct {
		Hash string `json:"hash"`
	} `json:"result"`
}

func GetEthereumHash() (*BlockHash, error) {
	var response ResponseEthereum
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
		"https://eth-mainnet.public.blastapi.io",
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

	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return nil, err

	}

	log.Printf("Ethereum hash")
	return &BlockHash{
		SourceName:   "Ethereum",
		OriginalHash: response.Result.Hash,
		ModifiedHash: response.Result.Hash,
	}, nil
}
