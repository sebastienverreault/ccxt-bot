import ccxt from "ccxt";
import fs from "fs";

// FTX
const ftxApiKey = process.env.FTX_KEY;
const ftxApiSecret = process.env.FTX_SECRET;

const ftxSymbol = "BTC-PERP";

export class Ftx {
  ftx;

  constructor() {
    this.ftx = new ccxt.ftx({ apiKey: ftxApiKey, secret: ftxApiSecret });
    console.log(this.ftx.requiredCredentials);
  }

  public async getExchangeBalance() {
    const balance = await this.ftx.fetchBalance();
    // console.log(`BTC: ${balance.total.BTC ?? 0}`);
    // console.log(`USD: ${balance.total.USD}`);
    console.log(`balance object: ${balance}`);
  }

  public async getMarkets() {
    const markets = await this.ftx.loadMarkets();
    const filename = "./ftx.market.json";
    fs.writeFile(filename, JSON.stringify(markets), function (err) {
      if (err) return console.log(err);
      console.log(`Error > ${filename}`);
    });
    // console.log(`Markets: ${JSON.stringify(markets)}`);
  }
}
