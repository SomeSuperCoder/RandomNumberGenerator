DC ?= docker-compose

.PHONY: build up down logs clean

build:
	$(DC) build --no-cache

up:
	$(DC) up -d

down:
	$(DC) down

logs:
	$(DC) logs -f --tail=200

clean:
	$(DC) down -v
	docker system prune -af --volumes
