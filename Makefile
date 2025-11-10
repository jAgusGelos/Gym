.PHONY: help install dev-backend dev-frontend dev db-up db-down db-reset

help: ## Mostrar ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instalar dependencias
	cd backend && npm install
	cd frontend && npm install

dev-backend: ## Ejecutar backend en modo desarrollo
	cd backend && npm run start:dev

dev-frontend: ## Ejecutar frontend en modo desarrollo
	cd frontend && npm run dev

dev: ## Ejecutar backend y frontend en paralelo (requiere tmux)
	tmux new-session -d -s gym 'cd backend && npm run start:dev' \; split-window -h 'cd frontend && npm run dev' \; attach

db-up: ## Iniciar PostgreSQL con Docker
	docker-compose up -d

db-down: ## Detener PostgreSQL
	docker-compose down

db-reset: ## Resetear base de datos
	docker-compose down -v
	docker-compose up -d
	sleep 3
	cd backend && npm run migration:run

backend-shell: ## Abrir shell en el directorio backend
	cd backend && bash

frontend-shell: ## Abrir shell en el directorio frontend
	cd frontend && bash
