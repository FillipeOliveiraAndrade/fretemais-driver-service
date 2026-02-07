# AI_PROMPTS.md

Este documento registra o uso de IA durante o desenvolvimento do desafio técnico.

## 1) Planejamento e arquitetura
**Prompt:**
"preciso fazer esse projeto em um desafio tecnico de uma vaga, monte pra mim um plano de desenvolvimento não precisa mandar código, você é como um Tech lead me orientando em arquitetura, estrutura e etc"  
**Contexto enviado:** PDF do desafio.  
**Resultado:** Recebi um plano de desenvolvimento, prioridades de implementação e sugestões de arquitetura.  
**Adaptação manual:** Usei o plano como guia, mas ajustei a ordem das tarefas para encaixar com o ritmo do projeto.

---

## 2) Pesquisa e consulta de referência
**Uso:** Consultei a web para relembrar configurações e detalhes técnicos.  
**Tópicos pesquisados:**
- Configuração de Swagger (Springdoc OpenAPI)
- Configuração de `application.yml` no Spring Boot  
**Resultado:** Confirmações de sintaxe/configuração.  
**Adaptação manual:** Ajustei os exemplos às necessidades do projeto (JWT, CORS, URL do banco).

---

## 3) Infra (Docker)
**Uso:** IA auxiliou na criação e ajustes de `docker-compose` e `Dockerfile`.  
**Resultado:** Estrutura de containers para Postgres + backend + frontend.  
**Adaptação manual:** Ajustei variáveis de ambiente, portas e organização em monorepo.

---

## 4) Documentação da API
**Uso:** IA auxiliou na escrita de descrições de endpoints e exemplos para Swagger.  
**Resultado:** OpenAPI mais claro para avaliação.  
**Adaptação manual:** Revisei nomes e mensagens para aderir ao domínio do projeto.

---

## 5) Testes automatizados
**Uso:** IA ajudou a criar testes unitários nas services (AuthService e DriverService).  
**Resultado:** Testes para fluxo de login e regras principais de motoristas.  
**Adaptação manual:** Ajustei mocks e tipos para evitar ambiguidades do Mockito.

---

## 6) Code review
**Uso:** IA realizou revisão de código para apontar riscos, melhorias e gaps.  
**Resultado:** Lista de melhorias (ex.: segredo JWT, organização, testes).  
**Adaptação manual:** Implementei as melhorias que faziam sentido dentro do prazo.

---

## 7) README
**Uso:** IA ajudou a formular um README detalhado e técnico.  
**Resultado:** Estrutura de documentação e conteúdo inicial.  
**Adaptação manual:** Ajustei os passos de execução, URLs e informações do monorepo.
