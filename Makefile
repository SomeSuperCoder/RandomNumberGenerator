all: build start

build:
	docker build -f ./rngbackend/services/api/Dockerfile -t=rngapi ./rngbackend/ 
start:
	docker-compose up
stop:
	docker-compose down
