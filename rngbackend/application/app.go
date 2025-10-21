package application

import (
	"context"
	"fmt"
	"net/http"
)

type App struct {
	router http.Handler
}

func New() *App {
	app := &App{}

	return app
}

func (a *App) Start(ctx context.Context) error {
	var err error

	// ========== Load Routes ==========
	a.router = loadRoutes()

	// ========== HTTP server ==========
	server := &http.Server{
		Addr:    ":8090",
		Handler: a.router,
	}

	err = server.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
