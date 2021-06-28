import { GenericExchange } from "./GenericExchange";

const ftxExchangeId = "ftx";
const ftxApiKey = process.env.FTX_KEY;
const ftxApiSecret = process.env.FTX_SECRET;
const ftxPassword = process.env.FTX_PASSWORD;

const okexExchangeId = "okex5";
const okexApiKey = process.env.OKEX_KEY;
const okexApiSecret = process.env.OKEX_SECRET;
const okexPassword = process.env.OKEX_PASSWORD;
// const okexApiKey = process.env.TRADE_OKEX_KEY;
// const okexApiSecret = process.env.TRADE_OKEX_SECRET;
// const okexPassword = process.env.TRADE_OKEX_PASSWORD;

const ftxSymbol = "BTC-PERP";
const okexSymbol = "BTC/USDT";

function main() {
  const ftx = new GenericExchange(ftxExchangeId, ftxApiKey, ftxApiSecret, ftxPassword, ftxSymbol);
  const okex = new GenericExchange(okexExchangeId, okexApiKey, okexApiSecret, okexPassword, okexSymbol);
  // const okex3 = new GenericExchange("okex", okexApiKey, okexApiSecret, okexPassword, okexSymbol);

  //   ftx.getBtcSpot();
  //   okex.getBtcSpot();

  // ftx.getBtcFutures();
  // okex.getBtcFutures();

  // ftx.getMethods();
  okex.getMethods();

  // ftx.getStats();
  // okex.getStats();
  // okex3.getStats();

  //   ftx.getMarkets();
  //   okex.getMarkets();

  // ftx.getBalances();
  // okex.getBalances();

  // ftx.getPositions();
  // okex.getPositions();

  // ftx.has();
  // okex.has();
  // okex3.has();

  // ftx.exchangeDepositAddress();
  // okex.exchangeDepositAddress();
}

main();
