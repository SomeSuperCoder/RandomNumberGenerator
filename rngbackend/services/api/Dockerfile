FROM golang:1.25.2-alpine3.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN go build -o main services/api/main.go

# Final stage
FROM alpine:3.22

RUN apk --no-cache add ca-certificates
RUN apk add --no-cache curl

WORKDIR /root
COPY --from=builder /app/main .
RUN touch .env
EXPOSE 8090

CMD [ "./main" ]
