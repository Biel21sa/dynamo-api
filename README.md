# 🛍️ Sistema de Gerenciamento de Estabelecimentos e Produtos

Este projeto é uma API para gerenciamento de usuários, estabelecimentos e produtos, com regras personalizadas por estabelecimento.

## 📚 Sumário

- [📦 Tecnologias](#-tecnologias)
- [📐 Estrutura das Entidades](#-estrutura-das-entidades)
  - [👤 User](#-user)
  - [🏢 Establishment](#-establishment)
  - [📦 Product](#-product)
  - [📏 EstablishmentRules](#-establishmentrules)
- [⚙️ Regras de Negócio](#️-regras-de-negócio)
- [🧪 Testes](#-testes)
- [▶️ Como Executar](#️-como-executar)
- [📁 Estrutura de Diretórios](#-estrutura-de-diretórios)

---

## 📦 Tecnologias

- Node.js
- AWS SDK (DynamoDB)
- UUID
- Dotenv
- Jest (para testes unitários)

---

## 🧩 Estrutura das Entidades

### 👤 User

**Campos**:

- `id` (UUID)
- `name`
- `email`
- `type`: `"owner"` ou `"customer"`

**Funcionalidades**:

- Criar usuário
- Buscar usuário por ID
- Atualizar usuário
- Deletar usuário
- Listar todos os usuários

---

### 🏢 Establishment

**Campos**:

- `id` (UUID)
- `name`
- `ownerId` (referência ao `User`)
- `type`: `"shopping"` ou `"local"`

**Funcionalidades**:

- Criar estabelecimento
- Buscar estabelecimento por ID
- Atualizar estabelecimento
- Deletar estabelecimento
- Buscar estabelecimentos por tipo
- Listar todos os estabelecimentos

---

### 📦 Product

**Campos**:

- `id` (UUID)
- `name`
- `price` (number)
- `type`: `"image"` ou `"video"`
- `establishmentId` (referência ao `Establishment`)

**Funcionalidades**:

- Criar produto
- Buscar produto por ID
- Atualizar produto
- Deletar produto
- Listar todos os produtos

---

### 📏 EstablishmentRules

**Campos**:

- `id` (UUID)
- `establishmentId` (referência ao `Establishment`)
- `picturesLimit` (número máximo de imagens)
- `videoLimit` (número máximo de vídeos)

**Funcionalidades**:

- Criar regra
- Buscar regra por ID do estabelecimento
- Atualizar regra
- Deletar regra

---

## ⚙️ Regras de Negócio

- Um `User` só pode criar um `Establishment` se for do tipo `"owner"`.
- Um `Establishment` só pode criar produtos respeitando os limites definidos em `EstablishmentRules`:
  - Limite de produtos do tipo `"image"` e `"video"` é controlado por `picturesLimit` e `videoLimit`.

---

## 🧪 Testes

- Os testes utilizam `Jest`.
- Para rodar os testes:

```bash
npm run test
```

---

## ▶️ Como Executar

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Suba o container Docker:

```bash
docker-compose up
```

4. Inicie o build:

```bash
npm run build
```

5. Inicie a aplicação:

```bash
npm run start
```

6. Criar as tabelas no banco:

```bash
npm run create-table
```

---

## 📂 Estrutura do Projeto

```
scripts/                # Scripts para configurar o banco
src/
├── 📂 models/          # Modelos das entidades
├── 📂 repositories/    # Acesso ao banco de dados (DynamoDB)
├── 📂 services/        # Lógica de negócio
├── 📂 controllers/     # Controllers se usar uma camada REST
├── 📂 utils/           # Funções auxiliares
tests/                  # Testes unitários
```
