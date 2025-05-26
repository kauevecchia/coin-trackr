## Requisitos Funcionais (RF)

- [ ] O usuário deve poder se cadastrar na plataforma.
- [ ] O usuário deve poder se autenticar (login) na plataforma.
- [ ] O usuário deve poder registrar uma **compra** de criptomoeda, informando:
  - Nome ou símbolo da cripto
  - Quantidade adquirida
  - Valor em dólar no momento da compra
  - Data da compra (opcional, padrão = data atual)
- [ ] O usuário deve poder registrar uma **venda** de criptomoeda, informando:
  - Nome ou símbolo da cripto
  - Quantidade vendida
  - Valor em dólar no momento da venda
  - Data da venda (opcional, padrão = data atual)
- [ ] O usuário deve poder listar todo o seu **histórico de transações** (compras e vendas).
- [ ] O usuário deve visualizar um **dashboard** com:
  - Saldo atual de cada cripto
  - Valor total investido
  - Valor atual do portfólio
  - Lucro ou prejuízo atual por cripto e no total
- [ ] O sistema deve consultar uma API externa para buscar o valor atual das criptomoedas.

---

## Regras de Negócio (RN)

- [ ]  O usuário não pode vender mais criptomoedas do que possui.
- [ ]  Toda transação (compra ou venda) deve registrar:
  - Quantidade
  - Valor por unidade na data da transação
  - Tipo da transação (compra ou venda)
- [ ]  Os cálculos de lucro/prejuízo são feitos com base na diferença entre:
  - O preço médio das compras daquela cripto
  - O preço atual da cripto (via API externa)
- [ ]  Cada usuário possui um portfólio individual. Nenhum dado é compartilhado entre usuários.
- [ ]  As transações não podem ser editadas, apenas adicionadas ou deletadas (para manter integridade histórica).
- [ ] Se o preço atual da cripto não estiver disponível (falha na API externa), o sistema deve retornar o último valor consultado (cache) ou uma mensagem de erro amigável.

---

## Requisitos Não Funcionais (RNF)

- [ ] A API deve ser desenvolvida utilizando **Node.js + Express**.
- [ ] O banco de dados utilizado deve ser **PostgreSQL**.
- [ ] A autenticação deve ser baseada em **JWT**.
- [ ] As senhas dos usuários devem ser armazenadas de forma segura utilizando **hash (bcrypt)**.
- [ ] As respostas da API devem seguir o padrão **RESTful**.
- [ ] Deve ser possível realizar deploy da API em plataformas como **Render, Railway, Vercel ou similar**.
- [ ] A API deve ter controle de erros global.
- [ ] Deve possuir documentação da API (ex.: Swagger ou README detalhado).
- [ ] A aplicação deve possuir testes básicos nas regras críticas (ex.: autenticação e transações).
- [ ] O sistema deve implementar cache dos preços das criptos por um período (ex.: 1h) para otimizar requisições na API externa.

---

## Tecnologias

### Backend

- Node.js
- Express.js
- PostgreSQL + Prisma ORM
- JWT + Bcrypt
- Axios
- Vitest

---

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- ESLint + Prettier

## Estrutura de Pastas (proposta inicial)
```
backend/
├── src/
│ ├── @types/
│ ├── env/
│ ├── http/
│ │ ├── controllers/
│ │ ├── middlewares/
│ ├── lib/
│ ├── repositories/
│ │ ├── in-memory/
│ │ ├── prisma/
│ ├── use-cases/
│ │ ├── errors/
│ │ ├── factories/
│ ├── utils/
│ ├── server.ts
│ └── app.ts
├── .env
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

frontend/
├── public/
├── src/
│ ├── @types/
│ ├── app/
│ ├── assets/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── lib/
│ ├── schemas/
│ ├── styles/
│ ├── utils/
├── .gitignore
├── eslint.config.mjs
├── next.config.js
├── package.json
├── package-lock.json
├── README.md
├── postcss.config.mjs
└── tsconfig.json
```