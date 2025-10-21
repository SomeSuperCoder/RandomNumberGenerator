package application

import (
	"fmt"
	"net/http"

	"github.com/SomeSuperCoder/RandomNumberGenerator/handlers"
	"github.com/SomeSuperCoder/RandomNumberGenerator/middleware"
)

func loadRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "OK")
	})
	mux.HandleFunc("/rng", handlers.GetRandomNumbers)

	return middleware.LoggerMiddleware(mux)
}
