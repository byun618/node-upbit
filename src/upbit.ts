import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import querystring from 'querystring'
import { v4 as uuidv4 } from 'uuid'
import {
  Account,
  LimitOrderPayload,
  MarketOrderPayload,
  Order,
  OrderResponse,
} from '.'
import Api from './lib/api'
import { WrongCoin } from './lib/error'

export default class Upbit extends Api {
  readonly #access: string
  readonly #secret: string

  constructor(access: string, secret: string) {
    super()
    this.#access = access
    this.#secret = secret
  }

  #getHeaders(data = null) {
    const payload = {
      access_key: this.#access,
      nonce: uuidv4(),
    }

    if (data) {
      const query = querystring.encode(data) // 요청할 파라미터 세팅
      const hash = crypto.createHash('sha512')
      const queryHash = hash.update(query, 'utf-8').digest('hex')
      Object.assign(payload, {
        query_hash: queryHash,
        query_hash_alg: 'SHA512',
      })
    }

    const token = jwt.sign(payload, this.#secret)
    return { Authorization: `Bearer ${token}` }
  }

  /**
   * 전체 계좌 잔고 조회
   * @returns {Promise<Account>} Account 배열
   */
  async getBalances(): Promise<Account[]> {
    const url = 'https://api.upbit.com/v1/accounts'
    const headers = this.#getHeaders()

    const { data } = await super.get<Account[]>(url, null, headers)

    return data
  }

  /**
   * 특정 currency 잔고 조회
   * @param {string} ticker KRW-BTC, KRW-ETH, ...
   * @returns
   */
  async getBalance(ticker: string = 'KRW-KRW'): Promise<Account> {
    const balances = await this.getBalances()
    const balance = balances.find(
      ({ currency }) => currency === ticker.split('-')[1],
    )

    if (!balance) {
      throw new WrongCoin()
    }

    return balance
  }

  /**
   * 지정가 매수
   * @param {LimitOrderPayload} param0 - { ticker: string, price: number, volume: number }
   * @returns {Promise<OrderResponse>} 지정가 매수 주문에 대한 결과
   */
  async buyLimitOrder({
    ticker,
    price,
    volume,
  }: LimitOrderPayload): Promise<OrderResponse> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'bid',
      volume: String(volume),
      price: String(price),
      ord_type: 'limit',
    }
    const headers = this.#getHeaders(data)

    const { data: result } = await super.post<OrderResponse>(url, data, headers)

    return result
  }

  /**
   * 시장가 매수
   * @param param0 - { ticker: string, price?: number, volume?: number }
   * @returns {Promise<Order>} 시장가 매수 주문에 대한 결과
   */
  async buyMarketOrder({
    ticker,
    price,
  }: MarketOrderPayload): Promise<OrderResponse> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'bid',
      price: String(price),
      ord_type: 'price',
    }
    const headers = this.#getHeaders(data)

    const { data: result } = await super.post<OrderResponse>(url, data, headers)

    return result
  }

  /**
   * 지정가 매도
   * @param param0 - { ticker: string, price: number, volume: number }
   * @returns {Promise<OrderResponse>} 지정가 매도 주문에 대한 결과
   */
  async sellLimitOrder({
    ticker,
    price,
    volume,
  }: LimitOrderPayload): Promise<OrderResponse> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'ask',
      volume: String(volume),
      price: String(price),
      ord_type: 'limit',
    }
    const headers = this.#getHeaders(data)

    const { data: result } = await super.post<OrderResponse>(url, data, headers)

    return result
  }

  /**
   * 시장가 매도
   * @param param0 - { ticker: string, price?: number, volume?: number }
   * @returns {Promise<OrderResponse>} 시장가 매도 주문에 대한 결과
   */
  async sellMarketOrder({
    ticker,
    volume,
  }: MarketOrderPayload): Promise<OrderResponse> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'ask',
      volume: String(volume),
      ord_type: 'market',
    }
    const headers = this.#getHeaders(data)

    const { data: result } = await super.post<OrderResponse>(url, data, headers)

    return result
  }

  /**
   * 주문 uuid로 개별 주문건 조회
   * @param {string} uuid - 주문 uuid
   * @returns {Promise<Order>} 주문 정보
   */
  async getOrder(uuid: string): Promise<Order> {
    const url = 'https://api.upbit.com/v1/order'
    const data = {
      uuid,
    }
    const headers = this.#getHeaders(data)

    const { data: result } = await super.get<Order>(url, data, headers)

    return result
  }
}
