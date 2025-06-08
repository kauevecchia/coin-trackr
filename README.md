## Functional Requirements (FR)

- [x] The user must be able to register on the platform.
- [x] The user must be able to authenticate (login) on the platform.
- [x] The user must be able to record a cryptocurrency purchase, providing:
    - Crypto name or symbol
    - Quantity acquired
    - Value in USD at the time of purchase
    - Purchase date (optional, default = current date)
- [x] The user must be able to record a cryptocurrency sale, providing:
    - Crypto name or symbol
    - Quantity sold
    - Value in USD at the time of sale
    - Sale date (optional, default = current date)
- [x] The user must be able to list their entire transaction history (purchases and sales).
- [ ] The user must view a dashboard with:
    - Current balance of each crypto
    - Total invested value
    - Current portfolio value
    - Current profit or loss per crypto and in total
- [ ] The system must consult an external API to fetch the current cryptocurrency values.

---

## Business Rules (BR)

- [x] The user cannot sell more cryptocurrency than they own.
- [x] Every transaction (buy or sell) must record:
    - Quantity
    - Value per unit at the transaction date
    - Transaction type (buy or sell)
- [ ] Profit/loss calculations are based on the difference between:
    - The average purchase price of that crypto
    - The current crypto price (via external API)
- [x] Each user has an individual portfolio. No data is shared between users.
- [x] Transactions cannot be edited, only added or deleted (to maintain historical integrity).
- [ ] If the current crypto price is not available (external API failure), the system must return the last consulted value (cache) or a user-friendly error message.

---

## Non-Functional Requirements (NFR)

- [ ] The API must be developed using Node.js + Express.
- [ ] The database used must be PostgreSQL.
- [ ] Authentication must be based on JWT.
- [ ] User passwords must be securely stored using hash (bcrypt).
- [ ] API responses must follow the RESTful standard.
- [ ] It must be possible to deploy the API on platforms like Render, Railway, Vercel, or similar.
- [ ] The API must have global error handling.
- [ ] API documentation must be provided (e.g., Swagger or detailed README).
- [ ] The application must have basic tests for critical rules (e.g., authentication and transactions).
- [ ] The system must implement cryptocurrency price caching for a period (e.g., 1h) to optimize external API requests.

---

## Technologies

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

## Folder Structure

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