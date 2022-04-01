/**
 * 원화마켓 주문 가격 단위 변환
 * @param {number} price 변환할 가격
 * @returns {number} 변환된 가격
 */
const getTickSize = (price: number): number => {
  if (price >= 2000000) {
    return Math.floor(price / 1000) * 1000
  } else if (price >= 1000000) {
    return Math.floor(price / 500) * 500
  } else if (price >= 500000) {
    return Math.floor(price / 100) * 100
  } else if (price >= 100000) {
    return Math.floor(price / 50) * 50
  } else if (price >= 10000) {
    return Math.floor(price / 10) * 10
  } else if (price >= 1000) {
    return Math.floor(price / 5) * 5
  } else if (price >= 100) {
    return Math.floor(price / 1) * 1
  } else if (price >= 10) {
    return Math.floor(price / 0.1) / 10
  } else {
    return Math.floor(price / 0.01) / 100
  }
}

export default {
  getTickSize,
}
