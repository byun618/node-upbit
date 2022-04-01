import Quotation from './quotation'
import Upbit from './upbit'

const test = async () => {
  const quotation = new Quotation()
  const upbit = new Upbit(
    process.env.UPBIT_ACCESS_KEY,
    process.env.UPBIT_SECRET_KEY,
  )

  const balances = await upbit.getBalances()
  console.log(balances)

  const balance = await upbit.getBalance()
  console.log(balance)
}

test()
