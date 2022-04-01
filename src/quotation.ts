import moment from 'moment-timezone'
import Api from './public/api'
import {
  Candle,
  GetOhlcvPayload,
  GetOhlcvRangeBasePayload,
  MarketAll,
  Ohlcv,
  Snapshot,
} from './public/interfaces'

export default class Quotation extends Api {
  /**
   * ACCESS_KEY, SECRET_KEY 필요없음
   */
  constructor() {
    super()
  }

  /**
   * 업비트 ticker code 조회
   * @param fiat - KRW, BTC, null 이면 all
   * @returns {Promise<string[]>} - ticker 배열
   */
  async getTickers(fiat: 'KRW' | 'BTC' | null = null): Promise<string[]> {
    const url = 'https://api.upbit.com/v1/market/all'
    const { data: items } = await super._get<MarketAll[]>(url)

    const _fiat = items
      .filter((item) => !fiat || fiat === item.market.split('-')[0])
      .map((fiat) => fiat.market)

    return _fiat
  }

  /**
   * 업비트 캔들 조회를 위한 URL
   * @param {string} interval - minute1, minutes1, ...
   * @returns {string}
   */
  #getUrlOhlcv(interval: string): string {
    if (['day', 'days'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/days'
    } else if (['minute1', 'minutes1'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/1'
    } else if (['minute3', 'minutes3'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/3'
    } else if (['minute5', 'minutes5'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/5'
    } else if (['minute10', 'minutes10'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/10'
    } else if (['minute15', 'minutes15'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/15'
    } else if (['minute30', 'minutes30'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/30'
    } else if (['minute60', 'minutes60'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/60'
    } else if (['minute240', 'minutes240'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/240'
    } else if (['week', 'weeks'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/weeks'
    } else if (['month', 'months'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/months'
    }
  }

  /**
   * 업비트 ohlcv 조회
   * @param {GetOhlcvPayload} param - { ticker?: string, interval?: string, count?: number, to?: string }
   * @returns {Promise<Ohlcv[]>} - Ohlcv 배열
   */
  async getOhlcv({
    ticker = 'KRW-BTC',
    interval = 'day',
    count = 200,
    to = null, // to 포맷 정형화 필요
  }: GetOhlcvPayload): Promise<Ohlcv[]> {
    const MAX_CALL_COUNT = 200
    if (count > MAX_CALL_COUNT) {
      throw new Error('200을 넘게 조회할 수 없습니다.')
    }

    const url = this.#getUrlOhlcv(interval)
    if (!url) {
      throw new Error('잘못된 시간 간격 입니다.')
    }

    const _to = moment(to).utc().format('YYYY-MM-DD HH:mm:ss')

    const { data: items } = await super._get<Candle[]>(
      `${url}?market=${ticker}&count=${count}${to ? `&to=${_to}` : ''}`,
    )

    return items
      .map((item) => {
        const datetime = moment(item.candle_date_time_kst)

        return {
          datetime,
          open: item.opening_price,
          high: item.high_price,
          low: item.low_price,
          close: item.trade_price,
          volume: item.candle_acc_trade_volume,
          value: item.candle_acc_trade_price,
        }
      })
      .reverse()
  }

  /**
   * to와 elapse를 이용해 지정한 범위 업비트 ohlcv 조회
   * @param {GetOhlcvRangeBasePayload} param0 - { ticker: string, to: string, elpase: number }
   * @returns {Promise<Ohlcv>}
   */
  async getOhlcvRangeBase({
    ticker,
    to,
    elapse,
  }: GetOhlcvRangeBasePayload): Promise<Ohlcv> {
    const result = await this.getOhlcv({
      ticker,
      interval: 'minute60',
      to,
      count: elapse,
    })

    if (result.length <= 0) {
      throw new Error('잘못된 범위 입니다.')
    }

    return {
      datetime: result[0].datetime,
      open: result[0].open,
      high: Math.max(...result.map(({ high }) => high)),
      low: Math.min(...result.map(({ low }) => low)),
      close: result[result.length - 1].close,
      volume: result.reduce((acc, { volume }) => acc + volume, 0),
      value: result.reduce((acc, { value }) => acc + value, 0),
    }
  }

  /**
   * 업비트 현재가 조회
   * @param {string} ticker - KRW-BTC, KRW-ETH, ...
   * @returns {Promise<Ohlcv>}
   */
  async getCurrentPrice(ticker: string = 'KRW-BTC'): Promise<number> {
    const url = 'https://api.upbit.com/v1/ticker'
    const { data } = await super._get<Snapshot[]>(`${url}?markets=${ticker}`)

    return data[0].trade_price
  }
}
