import Quotation from './quotation'
import Upbit from './upbit'
import Utils from './utils'
import { Moment } from 'moment-timezone'

export { Quotation, Upbit, Utils }

/**
 * 업비트 API 응답 Interface
 */
export interface MarketAll {
  market: string
  korean_name: string
  english_name: string
}

export interface Candle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
  prev_closing_price: number
  change_price: number
  change_rate: number
}

export interface Snapshot {
  market: string
  trade_date: string
  trade_time: string
  trade_date_kst: string
  trade_time_kst: string
  trade_timestamp: number
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: string
  change_price: number
  change_rate: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}

/**
 * Quatation Class Interface
 */

export type Fiat = 'KRW' | 'BTC' | null

export type Interval =
  | 'day'
  | 'days'
  | 'minute1'
  | 'minutes1'
  | 'minute3'
  | 'minutes3'
  | 'minute5'
  | 'minutes5'
  | 'minute15'
  | 'minutes15'
  | 'minute30'
  | 'minutes30'
  | 'minute60'
  | 'minutes60'
  | 'minute240'
  | 'minutes240'
  | 'week'
  | 'weeks'
  | 'month'
  | 'months'

export interface GetOhlcvPayload {
  ticker?: string
  interval?: Interval
  count?: number
  to?: string
}

export interface Ohlcv {
  datetime: Moment
  open: number
  high: number
  low: number
  close: number
  volume: number
  value: number
}

export interface GetOhlcvRangeBasePayload {
  ticker: string
  to: string
  timeInterval: number
}

/**
 * Upbit Class Interface
 */
export interface Account {
  currency: string
  balance: string
  locked: string
  avg_buy_price: string
  avg_buy_price_modified: boolean
  unit_currency: string
}

export interface LimitOrderPayload {
  ticker: string
  price: number
  volume: number
}

export interface MarketOrderPayload {
  ticker: string
  price?: number
  volume?: number
}

export interface OrderResponse {
  uuid: string
  side: string
  ord_type: string
  price: string
  state: string
  market: string
  created_at: string
  volume: string
  remaining_volume: string
  reserved_fee: string
  remaining_fee: string
  paid_fee: string
  locked: string
  executed_volume: string
  trades_count: number
}

interface Trade {
  market: string
  uuid: string
  price: string
  volume: string
  funds: string
  created_at: string
  side: string
}

export interface Order {
  uuid: string
  side: string
  ord_type: string
  price: string
  state: string
  market: string
  created_at: string
  volume: string
  remaining_volume: string
  reserved_fee: string
  remaining_fee: string
  paid_fee: string
  locked: string
  executed_volume: string
  trades_count: number
  trades: Trade[]
}
