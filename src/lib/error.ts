export class UpbitApiError extends Error {
  name: string
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}

export class OverMaxCallCount extends Error {
  constructor() {
    super('200을 넘게 조회할 수 없습니다.')
  }
}

export class BadTimeInterval extends Error {
  constructor() {
    super('잘못된 시간 간격 입니다.')
  }
}
export class WrongCoin extends Error {
  constructor() {
    super('보유한 코인이 아닙니다.')
  }
}
