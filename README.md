# 🚚 FreteMais - Sistema de Gestão de Motoristas

Sistema completo para cadastro, busca e gestão de motoristas parceiros, desenvolvido para organizar a base de motoristas da FreteMais e facilitar a busca por profissionais compatíveis com demandas de frete.

---

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalacao-e-execucao)
- [Como Usar o Sistema](#como-usar-o-sistema)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API - Documentação](#api---documentacao)
- [Decisões Técnicas](#decisoes-tecnicas)
- [Testes](#testes)
- [Melhorias Futuras](#melhorias-futuras)
- [Uso de IA](#uso-de-ia)
- [Autor](#autor)

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido para resolver um problema real da FreteMais: a dificuldade em gerenciar e localizar rapidamente motoristas parceiros quando há uma demanda de frete.

**Problema identificado:**
- Informações dos motoristas espalhadas em planilhas e WhatsApp
- Perda de tempo na busca por motoristas adequados
- Dificuldade em reutilizar contatos de bons profissionais

**Solução implementada:**
- Sistema web centralizado e seguro
- Busca avançada com filtros combináveis
- Interface intuitiva para equipe operacional
- Controle de acesso com autenticação

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.5**
- **Spring Security + JWT**
- **Spring Data JPA + Specifications**
- **PostgreSQL 16**
- **Flyway (migrations)**
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

## ⚙️ Funcionalidades

### ✅ Implementadas
- **Autenticação**
  - Login com email e senha
  - Rotas protegidas via JWT

- **Gestão de Motoristas (CRUD Completo)**
  - ➕ Cadastrar motorista
  - ✏️ Editar motorista
  - 📋 Listar motoristas
  - 👁️ Visualizar detalhes
  - 🗑️ Excluir motorista (soft delete)

- **Busca Avançada**
  - 🔍 Busca por texto (nome, email, telefone)
  - 🗺️ Filtro por Estado (UF)
  - 🏙️ Filtro por Cidade
  - 🚛 Filtro por tipos de veículo (múltipla seleção)
  - 📄 Paginação
  - 🔄 Ordenação por campo e direção
  - 🎯 Combinação simultânea de filtros

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Docker** (20.x ou superior)
- **Docker Compose** (2.x ou superior)

> ⚠️ Se você usar Docker, **não precisa** instalar Java, Node.js ou PostgreSQL localmente.

---

## 🚀 Instalacao e Execucao

### ✅ Modo recomendado (um único comando)

Este projeto foi organizado para o avaliador rodar tudo com **um único comando**:

```bash
cd /home/fillipe/fillipe/fretemais/fretemais-driver-service
docker compose up -d --build
```

Isso sobe automaticamente:
- PostgreSQL
- Backend
- Frontend

✅ **Nao e necessario rodar `npm install`, `npm run dev` ou `./mvnw`.**

Para parar:
```bash
docker compose down
```

---

## 📖 Como Usar o Sistema

### 1) Acesse o sistema
- Frontend: `http://localhost:3000`

### 2) Login (usuario seed)
- **Email:** `admin@fretemais.com`
- **Senha:** `fretemais@2026`

### 3) Navegação
Após login, você pode:
- Criar motoristas
- Editar e visualizar detalhes
- Excluir (soft delete)
- Filtrar e ordenar listagens

### 4) Tipos de veículo disponíveis
- VAN
- TOCO
- BAU
- SIDER
- TRUCK
- BITRUCK

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

---

## 🔌 API - Documentação

Swagger disponível em:
```
http://localhost:8080/swagger-ui.html
```

### Exemplo de busca
```
GET /drivers?text=maria&state=SP&vehicleTypes=VAN&vehicleTypes=TRUCK&page=0&size=10&sortBy=NAME&sortDir=ASC
```

Campos válidos para `sortBy`:
```
NAME, EMAIL, CREATED_AT, UPDATED_AT, CITY, STATE
```

---

## 💡 Decisões Técnicas

### 1) **PostgreSQL + array**
Tipos de veículo são persistidos em `TEXT[]` no Postgres, conforme requisito.  
O filtro por tipo usa a função `array_overlap(text[], text[])`.

### 2) **JWT para autenticação**
Autenticação stateless com expiração configurável.

### 3) **Soft delete**
Exclusões marcam o motorista como inativo, preservando histórico.

### 4) **Specifications**
Filtros dinâmicos e combináveis com JPA Specifications.

### 5) **Monorepo + Docker Compose**
Facilita a avaliação com um único comando.

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

---

## 👨‍💻 Autor
Preencha com seus dados:
- GitHub:
- LinkedIn:
- Email:
