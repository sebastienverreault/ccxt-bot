import { GenericExchange, ApiConfig } from "./GenericExchange";

enum Exchanges {
  FTX = "ftx",
  OKEX = "okex5",
}

const activeExchangeId = Exchanges.OKEX;

const activeApiConfig = new ApiConfig(undefined, undefined, undefined);

switch (activeExchangeId as Exchanges) {
  case Exchanges.FTX:
    activeApiConfig.apiKey = process.env.FTX_KEY
    activeApiConfig.secret = process.env.FTX_SECRET
    activeApiConfig.password = process.env.FTX_PASSWORD
    break;

  case Exchanges.OKEX:
    activeApiConfig.apiKey = process.env.OKEX_KEY
    activeApiConfig.secret = process.env.OKEX_SECRET
    activeApiConfig.password = process.env.OKEX_PASSWORD
    break;

  default:
    break;
}

const ftxExchangeId = "ftx";
// const ftxApiKey = process.env.SEB_FTX_KEY;
// const ftxApiSecret = process.env.SEB_FTX_SECRET;
// const ftxPassword = process.env.SEB_FTX_PASSWORD;
const ftxApiKey = process.env.NIC_FTX_KEY;
const ftxApiSecret = process.env.NIC_FTX_SECRET;
const ftxPassword = process.env.NIC_FTX_PASSWORD;
const ftxApiConfig = new ApiConfig(ftxApiKey, ftxApiSecret, ftxPassword);

const okexExchangeId = "okex5";
const okexApiKey = process.env.OKEX_KEY;
const okexApiSecret = process.env.OKEX_SECRET;
const okexPassword = process.env.OKEX_PASSWORD;
const okexApiConfig = new ApiConfig(okexApiKey, okexApiSecret, okexPassword);
// const okexApiKey = process.env.TRADE_OKEX_KEY;
// const okexApiSecret = process.env.TRADE_OKEX_SECRET;
// const okexPassword = process.env.TRADE_OKEX_PASSWORD;
// const okexApiConfig = new ApiConfig(okexApiKey, okexApiSecret, okexPassword);

const ftxSymbol = "BTC-PERP";
const okexSymbol = "BTC/USDT";

function main() {
  const ftx = new GenericExchange(ftxExchangeId, ftxApiConfig, ftxSymbol);
  const okex = new GenericExchange(okexExchangeId, okexApiConfig, okexSymbol);
  // const activeExchange = new GenericExchange(activeExchangeId, activeApiConfig, okexSymbol);

  //   ftx.getBtcSpot();
  //   okex.getBtcSpot();

  // ftx.getBtcFutures();
  // okex.getBtcFutures();

  // ftx.getMethods();
  // okex.getMethods();

  // ftx.getStats();
  // okex.getStats();
  // okex3.getStats();

  //   ftx.getMarkets();
  //   okex.getMarkets();

  ftx.fetchBalance();
  okex.fetchBalance();

  ftx.getPositions();
  okex.getPositions();

  // ftx.has();
  // okex.has();
  // okex3.has();

  ftx.fetchDepositAddress("BTC");
  okex.fetchDepositAddress("BTC");

  // console.log(activeExchange.name());
  // console.log(ftx.name());
  // console.log(okex.name());

  // console.log(ftx.has2());
  // console.log(okex.has2());
}

main();
