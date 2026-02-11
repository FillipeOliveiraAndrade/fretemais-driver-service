# 🚚 FreteMais - Sistema de Gestão de Motoristas

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Sistema web para cadastro, busca e gestão de motoristas parceiros. Foco em filtros combináveis, autenticação e experiência simples para uso interno.

**Acesso rápido (avaliador):**
```bash
docker compose up -d --build
```
Depois acesse o frontend em `http://localhost:3000`.

**Credenciais de acesso**
- Email: `admin@fretemais.com`
- Senha: `fretemais@2026`

---

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Decisões Técnicas](#decisões-técnicas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Como Usar o Sistema](#como-usar-o-sistema)
- [API - Documentação](#api---documentação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Melhorias Futuras](#melhorias-futuras)
- [Uso de IA](#uso-de-ia)

---

## 🎯 Sobre o Projeto

A FreteMais precisa organizar sua base de motoristas e permitir buscas rápidas por região, cidade/UF e tipos de veículo. Este projeto entrega uma solução web completa com:
- autenticação
- CRUD de motoristas
- busca avançada com filtros combináveis
- paginação e ordenação

---

## ⚙️ Funcionalidades

### ✅ Implementadas
- **Autenticação**
  - Login com email e senha
  - Rotas protegidas via JWT

- **Gestão de Motoristas (CRUD)**
  - ➕ Cadastrar motorista
  - ✏️ Editar motorista
  - 📋 Listar motoristas
  - 👁️ Visualizar detalhes
  - 🗑️ Excluir motorista (soft delete)

- **Busca Avançada (principal ponto do desafio)**
  - 🔍 Busca por texto (nome, email, telefone)
  - 🗺️ Filtro por UF
  - 🏙️ Filtro por cidade
  - 🚛 Filtro por tipos de veículo (múltipla seleção)
  - 📄 Paginação
  - 🔄 Ordenação por campo e direção
  - 🎯 Combinação simultânea de filtros

---

## 🏗️ Arquitetura

Monorepo com backend e frontend separados:

```
[ Frontend (Next.js) ]  --->  [ API Spring Boot ]  --->  [ PostgreSQL ]
```

Visão simplificada:
```
┌───────────────────────┐        ┌───────────────────────┐        ┌──────────────────────┐
│     Frontend          │        │       Backend         │        │      PostgreSQL      │
│  Next.js + React      │  --->  │  Spring Boot + JPA     │  --->  │  Dados dos motoristas│
└───────────────────────┘        └───────────────────────┘        └──────────────────────┘
```

### Backend (camadas principais)
- **Controller**: expõe endpoints REST
- **Service**: regras de negócio
- **Repository**: acesso aos dados (JPA)
- **DTOs**: requests/responses
- **Specifications**: filtros dinâmicos

---

## 💡 Decisões Técnicas

### 1) PostgreSQL + array de enums
- Requisito do desafio: `vehicleTypes` persistido como `TEXT[]`.
- Filtro por tipos usa função `array_overlap(text[], text[])`.

### 2) JWT para autenticação
- API stateless e simples de consumir pelo frontend.

### 3) Specifications para filtros combináveis
- Permite compor filtros dinâmicos sem explodir o número de queries.

### 4) Soft delete
- Remoção não apaga o registro: marca como inativo.

### 5) Monorepo + Docker Compose
- Facilita avaliação com um único comando.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.5**
- **Spring Security + JWT**
- **Spring Data JPA + Specifications**
- **PostgreSQL 16**
- **Flyway**
- **Swagger/OpenAPI (Springdoc)**
- **Maven**

### Frontend
- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### DevOps
- **Docker**
- **Docker Compose**

---

## 📦 Pré-requisitos

- **Docker** (20.x ou superior)
- **Docker Compose** (2.x ou superior)

> Usando Docker, não é necessário instalar Java, Node.js ou PostgreSQL localmente.

---

## 🚀 Instalação e Execução

### Passo 1: Clone o repositório
```bash
git clone https://github.com/seu-usuario/fretemais-driver-service.git
cd fretemais-driver-service
```

### Passo 2: Suba o ambiente completo
```bash
docker compose up -d --build
```

Isso iniciará:
- 🐘 **PostgreSQL** (porta 5432)
- ☕ **Backend** (porta 8080)
- ⚛️ **Frontend** (porta 3000)

### Passo 3: Aguarde a inicialização
O backend pode levar ~30 segundos para iniciar.
```bash
docker compose logs -f backend
```

Quando aparecer `Started ...Application`, está pronto.

### Passo 4: Acesse o sistema
- **Frontend:** `http://localhost:3000`
- **Swagger (API Docs):** `http://localhost:8080/swagger-ui.html`

### Parar o ambiente
```bash
docker compose down
```

Para apagar o banco e reiniciar do zero:
```bash
docker compose down -v
```

---

## 📖 Como Usar o Sistema

### 1) Acesse o frontend
`http://localhost:3000`

### 2) Faça login
- Email: `admin@fretemais.com`
- Senha: `fretemais@2026`

### 3) Use o sistema
Você pode:
- Criar, editar e excluir motoristas
- Filtrar por texto, cidade, UF e tipos de veículo
- Ordenar por nome, email, cidade, UF ou data

### 4) Seed automática
Ao subir o sistema, **20 motoristas** são criados automaticamente (apenas se o banco estiver vazio).

---

## 🔌 API - Documentação

Swagger disponível em:
```
http://localhost:8080/swagger-ui.html
```

### Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login e geração do token JWT |
| `GET` | `/drivers` | Lista com filtros, paginação e ordenação |
| `GET` | `/drivers/{id}` | Detalha motorista |
| `POST` | `/drivers` | Cria motorista |
| `PUT` | `/drivers/{id}` | Atualiza motorista |
| `DELETE` | `/drivers/{id}` | Remove (soft delete) |

### Parâmetros de busca
- `text` (nome/email/telefone)
- `city`
- `state`
- `vehicleTypes` (pode repetir)
- `page` (0-based)
- `size`
- `sortBy` (`NAME`, `EMAIL`, `CITY`, `STATE`, `CREATED_AT`, `UPDATED_AT`)
- `sortDir` (`ASC` ou `DESC`)

Exemplo:
```
GET /drivers?text=maria&state=SP&vehicleTypes=VAN&vehicleTypes=TRUCK&page=0&size=10&sortBy=NAME&sortDir=ASC
```

> Todas as rotas de `/drivers` exigem header:
```
Authorization: Bearer <token>
```

### Exemplo de login
```
POST /auth/login
```
Request:
```json
{
  "email": "admin@fretemais.com",
  "password": "fretemais@2026"
}
```
Response:
```json
{
  "token": "jwt_token",
  "expiresAt": "2026-02-05T10:00:00"
}
```

### Exemplo de criação de motorista
```
POST /drivers
```
Request:
```json
{
  "name": "João Silva",
  "email": "joao.silva@fretemais.com",
  "phone": "11990001111",
  "city": "São Paulo",
  "state": "SP",
  "vehicleTypes": ["VAN", "TRUCK"]
}
```

---

## 📁 Estrutura do Projeto
```
fretemais-driver-service/
├── backend/        # Spring Boot (API)
├── frontend/       # Next.js (UI)
├── docker-compose.yml
├── AI_PROMPTS.md
└── README.md
```

### Backend
```
backend/
├── src/main/java/com/fretemais/driver/service/
│   ├── auth/                # login, JWT, segurança
│   ├── common/              # erros padronizados, utils
│   ├── config/              # configurações (security/openapi)
│   └── driver/              # domínio de motoristas
│       ├── controller/
│       ├── domain/
│       ├── dto/
│       ├── repository/
│       ├── seed/
│       ├── service/
│       └── specification/
└── src/main/resources/
    └── db/migration/        # Flyway (migrations)
```

### Frontend
```
frontend/
├── src/app/                  # rotas (App Router)
├── src/components/           # componentes reutilizáveis
├── src/lib/                  # client API e helpers
└── src/hooks/                # hooks (auth, etc)
```

---

## 🧪 Testes

Testes unitários no backend:
```bash
cd backend
./mvnw test
```

Testes implementados:
- `AuthServiceTest`
- `DriverServiceTest`

---

## 🚀 Melhorias Futuras
- Refresh token
- Dashboard com métricas
- Exportação de dados
- Testes E2E no frontend

---

## 🤖 Uso de IA
O uso de IA está documentado em:
```
AI_PROMPTS.md
```
