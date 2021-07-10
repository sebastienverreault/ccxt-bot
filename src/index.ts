import { GenericExchange, SupportedExchanges, ApiConfig } from "./GenericExchange"

const activeExchangeId = SupportedExchanges.OKEXv5
const activeApiConfig = new ApiConfig(activeExchangeId, undefined, undefined, undefined)
switch (activeExchangeId as SupportedExchanges) {
  case SupportedExchanges.FTX:
    activeApiConfig.apiKey = process.env.FTX_KEY
    activeApiConfig.secret = process.env.FTX_SECRET
    activeApiConfig.password = process.env.FTX_PASSWORD
    break

  case SupportedExchanges.OKEXv5:
    activeApiConfig.apiKey = process.env.OKEX_KEY
    activeApiConfig.secret = process.env.OKEX_SECRET
    activeApiConfig.password = process.env.OKEX_PASSWORD
    break

  default:
    break
}

// const ftxApiKey = process.env.SEB_FTX_KEY;
// const ftxApiSecret = process.env.SEB_FTX_SECRET;
// const ftxPassword = process.env.SEB_FTX_PASSWORD;
const ftxApiKey = process.env.NIC_FTX_KEY
const ftxApiSecret = process.env.NIC_FTX_SECRET
const ftxPassword = process.env.NIC_FTX_PASSWORD
// const ftxApiKey = process.env.NIC_TRADE_FTX_KEY
// const ftxApiSecret = process.env.NIC_TRADE_FTX_SECRET
// const ftxPassword = process.env.NIC_TRADE_FTX_PASSWORD
const ftxApiConfig = new ApiConfig(
  SupportedExchanges.FTX,
  ftxApiKey,
  ftxApiSecret,
  ftxPassword,
)

const okexApiKey = process.env.OKEX_KEY
const okexApiSecret = process.env.OKEX_SECRET
const okexPassword = process.env.OKEX_PASSWORD
const okexApiConfig = new ApiConfig(
  SupportedExchanges.OKEXv5,
  okexApiKey,
  okexApiSecret,
  okexPassword,
)
// const okexApiKey = process.env.TRADE_OKEX_KEY;
// const okexApiSecret = process.env.TRADE_OKEX_SECRET;
// const okexPassword = process.env.TRADE_OKEX_PASSWORD;
// const okexApiConfig = new ApiConfig(okexApiKey, okexApiSecret, okexPassword);

const ftxSymbol = "BTC-PERP"
const okexSymbol = "BTC-USD-211231"
// const okexSymbol = "BTC-USD-210709"
// const okexSymbol = "BTC/USDT"
const okexSwapSymbol = "BTC-USD-SWAP"

async function main() {
  try {
    const ftx = new GenericExchange(ftxApiConfig)
    const okex = new GenericExchange(okexApiConfig)
    // const activeExchange = new GenericExchange(activeExchangeId, activeApiConfig, okexSymbol);

    // ftx.getBtcSpot();
    // okex.getBtcSpot();

    // ftx.getBtcFutures();
    // okex.getBtcFutures();

    // ftx.getMethods();
    // okex.getMethods();

    // const ftxStats = await ftx.getStats()
    // const okexStats = await okex.getStats()
    // okex3.getStats();

    //   ftx.getMarkets();
    //   okex.getMarkets();

    //////////////////////////////////

    //
    // has()
    //
    // ftx.has();
    // okex.has();
    // okex3.has();

    //
    // fetchDepositAddress("BTC")
    //
    // ftx.fetchDepositAddress("BTC");
    // okex.fetchDepositAddress("BTC");

    //
    // fetchBalance()
    //
    // const ftxBal = await ftx.fetchBalance()
    // console.log(`balance.total.BTC = ${ftxBal.total.BTC}`)
    // console.log(`balance.total.USD = ${ftxBal.total.USD}`)
    // const okexBal = await okex.fetchBalance()
    // console.log(`balance.total.BTC = ${okexBal.total.BTC}`)
    // console.log(`balance.total.USDT = ${okexBal.total.USDT}`)

    //
    // getNextFundingRate(this.symbol)
    //
    // const ftxFundingRate = await ftx.getNextFundingRate(ftxSymbol)
    // console.log(`NextFundingrate = ${JSON.stringify(ftxFundingRate)}`)
    // console.log(
    //   `NextFundingrate.nextFundingRate = ${ftxFundingRate.result.nextFundingRate}`,
    // )
    // const okexFundingRate = await okex.getNextFundingRate(okexSwapSymbol)
    // console.log(`NextFundingrate = ${JSON.stringify(okexFundingRate)}`)
    // console.log(
    //   `NextFundingrate.nextFundingRate = ${okexFundingRate.data[0].nextFundingRate}`,
    // )

    //
    // privateGetAccount()
    //
    // const ftxAccount = await ftx.privateGetAccount()
    // console.log(JSON.stringify(ftxAccount))
    // const okexAccount = await okex.privateGetAccount()
    // console.log(JSON.stringify(okexAccount))

    //
    // name()
    //
    // console.log(activeExchange.name());
    // console.log(ftx.name());
    // console.log(okex.name());

    //
    // withdraw(currency, btcAmount, address)
    //

    //
    // createOrder(this.symbol, orderType, buyOrSell,
    //

    //
    // fetchOrder(order.id)
    //

    // await ftx.getPositions()
    // await okex.getPositions()

    // let since = exchange.milliseconds () - 86400000 // -1 day from now
    // alternatively, fetch from a certain starting datetime
    // let since = exchange.parse8601 ('2018-01-01T00:00:00Z')
    const since = ftx.exchange.parse8601("2018-01-01T00:00:00Z")

    // await ftx.fetchMyTrades(since)
    await okex.fetchMyTrades(since)

    // await ftx.fetchDeposits(since)
    // await okex.fetchDeposits(since)

    // await ftx.fetchWithdrawals(since)
    // await okex.fetchWithdrawals(since)

    // console.log(ftx.has2());
    // console.log(okex.has2());
  } catch (error) {
    console.log(error)
  }
}

main()
