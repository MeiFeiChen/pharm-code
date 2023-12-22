export class TimeLimitExceededError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TimeLimitExceededError'
    this.statusCode = 400
  }
}

export class RunTimeError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RunTimeError'
    this.statusCode = 400
  }
}

export class WrongAnswerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'WrongAnswerError'
    this.statusCode = 400
  }
}
