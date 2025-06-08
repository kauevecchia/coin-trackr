export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds for this crypto')
  }
}
