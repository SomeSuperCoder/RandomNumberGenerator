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
	mux.HandleFunc("GET /rng", handlers.GetRandomNumbers)
	mux.HandleFunc("GET /audit/bin", handlers.BinaryAuditor)
	mux.HandleFunc("GET /audit/int", handlers.IntAuditor)

	return middleware.LoggerMiddleware(middleware.CORSMiddleware(mux))
}
