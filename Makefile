# короткий Makefile для backend+frontend
DC ?= docker compose

API_IMG = rngapi
WEB_IMG = rngweb

BACKEND_DOCKERFILE = ./rngbackend/services/api/Dockerfile
BACKEND_CONTEXT    = ./rngbackend
FRONTEND_DOCKERFILE = ./rngfrontend/Dockerfile
FRONTEND_CONTEXT    = ./rngfrontend

.PHONY: all build up down logs restart clean

all: build up

build:
	docker build -f $(BACKEND_DOCKERFILE)  -t $(API_IMG) $(BACKEND_CONTEXT)
	docker build -f $(FRONTEND_DOCKERFILE) -t $(WEB_IMG) $(FRONTEND_CONTEXT)

up:
	$(DC) up -d

down:
	$(DC) down

logs:
	$(DC) logs -f --tail=200

restart:
	$(DC) restart

clean:
	$(DC) down -v
