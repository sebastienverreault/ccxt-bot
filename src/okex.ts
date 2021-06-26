import ccxt from "ccxt";
import fs from "fs";

// OKEx
const okexApiKey = process.env.OKEX_KEY;
const okexApiSecret = process.env.OKEX_SECRET;

const okexSymbol = "BTC/USDT";

export class Okex {
  okex;

  constructor() {
    this.okex = new ccxt.okex({ apiKey: okexApiKey, secret: okexApiSecret });
  }

  public async getExchangeBalance() {
    const balance = await this.okex.fetchBalance();
    // console.log(`BTC: ${balance.total.BTC ?? 0}`);
    // console.log(`USD: ${balance.total.USD}`);
    console.log(`balance object: ${balance}`);
  }

  public async getMarkets() {
    const markets = await this.okex.loadMarkets();
    const filename = "./okex.market.json";
    fs.writeFile(filename, JSON.stringify(markets.json), function (err) {
      if (err) return console.log(err);
      console.log(`Error > ${filename}`);
    });
    // console.log(`Markets: ${JSON.stringify(markets)}`);
  }
}
