package utils

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

func CheckGetFromDB(w http.ResponseWriter, err error) bool {
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, fmt.Sprintf("Not found: %s", err.Error()), http.StatusNotFound)
			return true
		}
		http.Error(w, fmt.Sprintf("Failed to get from DB: %s", err.Error()), http.StatusInternalServerError)
		return true
	}
	return false
}

func CheckJSONError(w http.ResponseWriter, err error) bool {
	return CheckError(w, err, "Failed to parse JSON", http.StatusBadRequest)
}

func CheckJSONValidError(w http.ResponseWriter, err error) bool {
	return CheckError(w, err, "JSON validation failed", http.StatusBadRequest)
}

func CheckError(w http.ResponseWriter, err error, message string, code int) bool {
	if err != nil {
		http.Error(w, fmt.Sprintf("%v: %v", message, err.Error()), code)
		return true
	}
	return false
}

func CheckErrorDeadly(err error, message string) {
	if err != nil {
		log.Fatalf("%v: %v", message, err.Error())
		os.Exit(1)
	}
}
