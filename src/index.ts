import { GenericExchange, SupportedExchanges, ApiConfig } from "./GenericExchange"

// enum Exchanges {
//   FTX = "ftx",
//   OKEX = "okex5",
// }

const activeExchangeId = SupportedExchanges.OKEX

const activeApiConfig = new ApiConfig(undefined, undefined, undefined)

switch (activeExchangeId as SupportedExchanges) {
  case SupportedExchanges.FTX:
    activeApiConfig.apiKey = process.env.FTX_KEY
    activeApiConfig.secret = process.env.FTX_SECRET
    activeApiConfig.password = process.env.FTX_PASSWORD
    break

  case SupportedExchanges.OKEX:
    activeApiConfig.apiKey = process.env.OKEX_KEY
    activeApiConfig.secret = process.env.OKEX_SECRET
    activeApiConfig.password = process.env.OKEX_PASSWORD
    break

  default:
    break
}

const ftxExchangeId = "ftx"
// const ftxApiKey = process.env.SEB_FTX_KEY;
// const ftxApiSecret = process.env.SEB_FTX_SECRET;
// const ftxPassword = process.env.SEB_FTX_PASSWORD;
const ftxApiKey = process.env.NIC_FTX_KEY
const ftxApiSecret = process.env.NIC_FTX_SECRET
const ftxPassword = process.env.NIC_FTX_PASSWORD
const ftxApiConfig = new ApiConfig(ftxApiKey, ftxApiSecret, ftxPassword)

const okexExchangeId = "okex5"
const okexApiKey = process.env.OKEX_KEY
const okexApiSecret = process.env.OKEX_SECRET
const okexPassword = process.env.OKEX_PASSWORD
const okexApiConfig = new ApiConfig(okexApiKey, okexApiSecret, okexPassword)
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
  const ftx = new GenericExchange(ftxExchangeId, ftxApiConfig, ftxSymbol)
  const okex = new GenericExchange(okexExchangeId, okexApiConfig, okexSymbol)
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

  // const ftxFundingRate = await ftx.getNextFundingRate(ftxSymbol)
  // console.log(`NextFundingrate = ${JSON.stringify(ftxFundingRate)}`)
  // console.log(
  //   `NextFundingrate.nextFundingRate = ${ftxFundingRate.result.nextFundingRate}`,
  // )

  try {
    const okexFundingRate = await okex.getNextFundingRate(okexSwapSymbol)
    console.log(`NextFundingrate = ${JSON.stringify(okexFundingRate)}`)
    console.log(
      `NextFundingrate.nextFundingRate = ${okexFundingRate.data[0].nextFundingRate}`,
    )
  } catch (error) {
    console.log(error)
  }

  // const ftxBal = await ftx.fetchBalance();
  // console.log(`balance.total.BTC = ${ftxBal.total.BTC}`)
  // console.log(`balance.total.USD = ${ftxBal.total.USD}`)
  // const okexBal = await okex.fetchBalance();
  // console.log(`balance.total.BTC = ${okexBal.total.BTC}`)
  // console.log(`balance.total.USDT = ${okexBal.total.USDT}`)

  // ftx.getPositions();
  // okex.getPositions();

  // ftx.has();
  // okex.has();
  // okex3.has();

  // ftx.fetchDepositAddress("BTC");
  // okex.fetchDepositAddress("BTC");

  // console.log(activeExchange.name());
  // console.log(ftx.name());
  // console.log(okex.name());

  // console.log(ftx.has2());
  // console.log(okex.has2());
}

main()
