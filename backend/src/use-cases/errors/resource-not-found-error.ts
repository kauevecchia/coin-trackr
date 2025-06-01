export class InvalidCredentialsError extends Error {
  constructor() {
    super('Resource not found')
  }
}
