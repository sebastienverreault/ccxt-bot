import ccxt, { ExchangeId } from "ccxt";
import fs from "fs";

export class GenericExchange {
  tempDir;
  exchangeName;
  exchange;
  symbol;

  constructor(
    exchangeName: string,
    apiKey: string | undefined,
    secret: string | undefined,
    symbol: string
  ) {
    this.tempDir = 'temp-data'
    this.exchangeName = exchangeName;
    this.symbol = symbol;
    const exchangeId = this.exchangeName as ExchangeId;
    const exchangeClass = ccxt[exchangeId];
    this.exchange = new exchangeClass({
      apiKey: apiKey,
      secret: secret,
    });
    console.log(this.exchange.requiredCredentials);
  }

  public async getExchangeBalance() {
    const balance = await this.exchange.fetchBalance();
    // console.log(`BTC: ${balance.total.BTC ?? 0}`);
    // console.log(`USD: ${balance.total.USD}`);
    console.log(`balance object: ${balance}`);
  }

  public async getBtcSpot() {
    this.getInstrument("BTC", "spot");
  }

  public async getBtcFutures() {
    this.getInstrument("BTC", "future");
  }

  public async getInstrument(base: string, type: string) {
    const markets = await this.exchange.loadMarkets(true);
    let data = "";

    for (let symbol in markets) {
      try {
        if (!symbol.includes("MOVE")) {
          const market = markets[symbol];
          if (market["base"] === base || market["quote"] === base)
            if (market["type"] === type || market["type"] === type + "s") {
              const ticker = await this.exchange.fetchTicker(symbol);
              data += `symbol = ${symbol}\n`;
              data += `Market = ${JSON.stringify(market)}\n`;
              data += `Ticker = ${JSON.stringify(ticker)}\n`;
              await (ccxt as any).sleep(this.exchange.rateLimit);
            }
        }
      } catch (error) {
        data += `error = ${error}\n`;
      }
    }

    const filename = `${this.tempDir}/${this.exchangeName}.${type}.json`;
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  // Sub-class this to implement exchange specific method
  public async getStats() {
    const filename = `${this.tempDir}/${this.exchangeName}.stats.json`;
    let data = "";
    if (this.exchangeName === "ftx") {
      data = JSON.stringify(
        // this.exchange.fetchFundingFees({
        this.exchange.publicGetFuturesFutureNameStats({
          future_name: this.symbol,
        })
      );
    } else if (this.exchangeName === "okex") {
      data = JSON.stringify(
        this.exchange.fetchFundingFees({
          future_name: this.symbol,
        })
      );
    }
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async getMethods() {
    const filename = `${this.tempDir}/${this.exchangeName}.methods.json`;
    const data = Object.keys(this.exchange).join("\n").toString();
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async getMarkets() {
    const markets = await this.exchange.loadMarkets();
    const filename = `${this.tempDir}/${this.exchangeName}.market.json`;
    fs.writeFile(filename, JSON.stringify(markets), function (err) {
      if (err) return console.log(err);
    });
  }
}
