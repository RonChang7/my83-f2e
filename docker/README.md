# MY83 F2E Docker

## 環境需求
- Docker for macOS
- docker-sync, unison, eugenmayer/dockersync/unox [安裝方式](https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html)

## 使用方式
複製 `.env.example` 並命名 `.env`
```
cp .env.example .env
```

依照自己需求改寫 `COMPOSE_FILE`
- 開發用 `docker-compose.dev.yml`
- 直接放出 port 用 `docker-compose.expose.yml`, 使用 my83-gateway 用 `docker-compose.gateway.yml`
- 使用 docker-sync `docker-compose.sync.yml`

設定 `DOCKER_HOST_IP`
- docker run -it busybox ping host.docker.internal -c 1
- 由回應的 IP 填入 DOCKER_HOST_IP