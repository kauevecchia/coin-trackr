// src/use-cases/test/list-user-transactions.spec.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { ListUserTransactionsUseCase } from '@/use-cases/list-user-transactions'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let transactionsRepository: InMemoryTransactionsRepository
let sut: ListUserTransactionsUseCase // System Under Test

// Dados de teste para o usuário e criptos
const TEST_USER_ID = 'user-test-id'
const BTC_SYMBOL = 'BTC'
const ETH_SYMBOL = 'ETH'
const ADA_SYMBOL = 'ADA'

describe('List User Transactions Use Case', () => {
  beforeEach(async () => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new ListUserTransactionsUseCase(transactionsRepository)

    // Popula o repositório em memória com dados de transação para os testes
    // Transações para o TEST_USER_ID
    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.5),
      price_at_transaction: new Decimal(30000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-01-10T10:00:00Z'), // Transação mais antiga
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ETH_SYMBOL,
      crypto_name: 'Ethereum',
      quantity: new Decimal(2.0),
      price_at_transaction: new Decimal(2000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-02-15T12:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.2),
      price_at_transaction: new Decimal(35000),
      transaction_type: TransactionType.SELL, // Venda de BTC
      transaction_date: new Date('2023-03-01T14:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ADA_SYMBOL,
      crypto_name: 'Cardano',
      quantity: new Decimal(500),
      price_at_transaction: new Decimal(0.5),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-04-20T08:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ETH_SYMBOL,
      crypto_name: 'Ethereum',
      quantity: new Decimal(0.5),
      price_at_transaction: new Decimal(2500),
      transaction_type: TransactionType.SELL, // Venda de ETH
      transaction_date: new Date('2023-05-25T16:00:00Z'), // Transação mais recente
    })

    // Adiciona uma transação para outro usuário para garantir isolamento
    await transactionsRepository.create({
      user_id: 'another-user-id',
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.1),
      price_at_transaction: new Decimal(28000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-06-01T09:00:00Z'),
    })
  })

  // Teste 1: Deve ser capaz de listar todas as transações de um usuário sem filtros
  it('should be able to list all transactions for a user without filters', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
    })

    expect(transactions).toHaveLength(5) // Espera 5 transações para o TEST_USER_ID
    expect(transactions[0].crypto_symbol).toEqual(ETH_SYMBOL) // Verifica ordem (mais recente primeiro, se o findAll ordenar)
    expect(transactions[0].transaction_type).toEqual(TransactionType.SELL)
  })

  // Teste 2: Deve ser capaz de listar transações filtradas por tipo (BUY)
  it('should be able to list transactions filtered by BUY type', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.BUY,
      },
    })

    expect(transactions).toHaveLength(3) // Espera 3 compras (BTC, ETH, ADA)
    expect(
      transactions.every((t) => t.transaction_type === TransactionType.BUY),
    ).toBe(true)
  })

  // Teste 3: Deve ser capaz de listar transações filtradas por tipo (SELL)
  it('should be able to list transactions filtered by SELL type', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.SELL,
      },
    })

    expect(transactions).toHaveLength(2) // Espera 2 vendas (BTC, ETH)
    expect(
      transactions.every((t) => t.transaction_type === TransactionType.SELL),
    ).toBe(true)
  })

  // Teste 4: Deve ser capaz de listar transações filtradas por símbolo de cripto (BTC)
  it('should be able to list transactions filtered by crypto symbol', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        cryptoSymbol: BTC_SYMBOL,
      },
    })

    expect(transactions).toHaveLength(2) // Espera 2 transações para BTC (1 compra, 1 venda)
    expect(transactions.every((t) => t.crypto_symbol === BTC_SYMBOL)).toBe(true)
  })

  // Teste 5: Deve ser capaz de listar transações filtradas por intervalo de datas (startDate)
  it('should be able to list transactions filtered by start date', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        startDate: new Date('2023-03-01T00:00:00Z'), // A partir de 1 de março
      },
    })

    // Espera transações de Março, Abril, Maio (3 transações)
    expect(transactions).toHaveLength(3)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-05-25T16:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-04-20T08:00:00.000Z',
    )
    expect(transactions[2].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
  })

  // Teste 6: Deve ser capaz de listar transações filtradas por intervalo de datas (endDate)
  it('should be able to list transactions filtered by end date', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        endDate: new Date('2023-03-01T23:59:59Z'), // Até 1 de março
      },
    })

    // Espera transações de Janeiro, Fevereiro, e a de Março (venda BTC)
    // A de Março entra se o timestamp for <= ao endDate
    expect(transactions).toHaveLength(3)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-02-15T12:00:00.000Z',
    )
    expect(transactions[2].transaction_date.toISOString()).toBe(
      '2023-01-10T10:00:00.000Z',
    )
  })

  // Teste 7: Deve ser capaz de listar transações filtradas por intervalo de datas (startDate e endDate)
  it('should be able to list transactions filtered by date range', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        startDate: new Date('2023-02-01T00:00:00Z'), // A partir de 1 de Fev
        endDate: new Date('2023-03-31T23:59:59Z'), // Até 31 de Março
      },
    })

    // Espera transações de Fev (ETH compra) e Março (BTC venda)
    expect(transactions).toHaveLength(2)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-02-15T12:00:00.000Z',
    )
  })

  // Teste 8: Deve ser capaz de listar transações com múltiplos filtros (tipo e símbolo)
  it('should be able to list transactions with multiple filters (type and symbol)', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.BUY,
        cryptoSymbol: BTC_SYMBOL,
      },
    })

    expect(transactions).toHaveLength(1) // Espera apenas a compra de BTC
    expect(transactions[0].crypto_symbol).toEqual(BTC_SYMBOL)
    expect(transactions[0].transaction_type).toEqual(TransactionType.BUY)
  })

  // Teste 9: Deve retornar um array vazio se nenhuma transação for encontrada para os filtros
  it('should return an empty array if no transactions are found for the filters', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        cryptoSymbol: 'NONEXISTENT', // Símbolo de cripto que não existe
      },
    })

    expect(transactions).toHaveLength(0)
  })

  // Teste 10: Não deve listar transações de outros usuários
  it('should not list transactions from other users', async () => {
    const { transactions } = await sut.execute({
      userId: 'another-user-id', // Busca transações do outro usuário
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0].crypto_symbol).toEqual(BTC_SYMBOL)
    expect(transactions[0].user_id).toEqual('another-user-id')
  })
})
