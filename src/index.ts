// import ccxt from "ccxt";
import { Ftx } from "./ftx";
import { Okex } from "./okex";
import { GenericExchange } from "./GenericExchange";

const ftxApiKey = process.env.FTX_KEY;
const ftxApiSecret = process.env.FTX_SECRET;

const okexApiKey = process.env.OKEX_KEY;
const okexApiSecret = process.env.OKEX_SECRET;

const ftxSymbol = "BTC-PERP";
const okexSymbol = "BTC/USDT";

function main() {
  //   const ftx = new Ftx();
  //   const okex = new Okex();
  const ftx = new GenericExchange("ftx", ftxApiKey, ftxApiSecret, ftxSymbol);
  const okex = new GenericExchange(
    "okex",
    okexApiKey,
    okexApiSecret,
    okexSymbol
  );

  //   ftx.getBtcSpot();
  //   okex.getBtcSpot();

  ftx.getBtcFutures();
  okex.getBtcFutures();

  //   ftx.getMethods();
  //   okex.getMethods();

  //   ftx.getStats();
  //   okex.getStats();

  //   ftx.getMarkets();
  //   okex.getMarkets();

  //   ftx.getExchangeBalance();
  //   okex.getExchangeBalance();
}

main();
