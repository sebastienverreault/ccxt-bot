import ccxt, { ExchangeId, Order } from "ccxt";
import fs from "fs";
import dateFormat from "dateformat";
import path from "path"

const DATE_FORMAT_STRING = "yyyymmdd.HHMMss";
const TEMP_DIR = 'temp-data';

export class ApiConfig {
  constructor(
    public apiKey: string | undefined,
    public secret: string | undefined,
    public password: string | undefined
  ) {
    ;
  };
}

export class GenericExchange {
  dateFormatString
  tempDir;
  exchangeName;
  exchange;
  symbol;

  // public ccxt;

  constructor(
    exchangeName: string,
    apiConfig: ApiConfig,
    symbol: string
  ) {
    this.dateFormatString = DATE_FORMAT_STRING;
    this.tempDir = TEMP_DIR
    this.exchangeName = exchangeName;
    this.symbol = symbol;
    const exchangeId = this.exchangeName as ExchangeId;
    const exchangeClass = ccxt[exchangeId];
    this.exchange = new exchangeClass({
      apiKey: apiConfig.apiKey,
      secret: apiConfig.secret,
      password: apiConfig.password,
    });
    // this.ccxt = this.exchange;
    console.log(this.exchange.requiredCredentials);
    console.log(this.exchange.checkRequiredCredentials());
  }

  public GetSymbol() {
    // Should resolve best instrument to used given the exchange and the market conditions.
    const optimalSymbol = this.symbol;
    this.symbol = optimalSymbol;
    return this.symbol;
  }

  public has() {
    const has = this.exchange.has;
    const data = JSON.stringify(has);

    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.has.${datetime}.json`)
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public has2() {
    const has = this.exchange.has;
    return has;
  }

  public name() {
    const name = this.exchange.name;
    return name;
  }

  async fetchDepositAddress(currency: string) {
    const address = await this.exchange.fetchDepositAddress(currency)
    const data = JSON.stringify(address);
    // console.log(data);

    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.deposit.address.${datetime}.json`)
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async withdraw(currency: string, amount: number, address: string) {
    const withdrawalResult = await this.exchange.withdraw(currency, amount, address)
    return withdrawalResult;
  }

  public async createOrder(symbol: string, type: Order['type'], side: Order['side'], amount: number) {
    const order = await this.exchange.createOrder(symbol, type, side, amount)
    return order;
  }

  public async fetchOrder(id: string) {
    const order = await this.exchange.fetchOrder(id, this.symbol)
    return order;
  }

  public async getPositions() {
    const positions = await this.exchange.fetchPositions();
    const data = JSON.stringify(positions);
    // console.log(`positions object: ${data}`);

    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.positions.${datetime}.json`)
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async fetchBalance() {
    const balances = await this.exchange.fetchBalance();
    const data = JSON.stringify(balances.info);
    // console.log(`balances: ${data}`);

    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.balances.${datetime}.json`)
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
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

    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.${type}.${datetime}.json`)
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async getNextFundingRate(symbol: string) {
    if (this.exchangeName === "ftx") {
      const result = await this.exchange.publicGetFuturesFutureNameStats({ future_name: symbol });
      return result;
    } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
      // following method does not exist...
      const result = await this.exchange.publicGetFuturesFutureNameStats({ future_name: symbol });
      return result;
    }
  }

  public async privateGetAccount() {
    if (this.exchangeName === "ftx") {
      const result = await this.exchange.privateGetAccount();
      return result;
    } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
      // following method does not exist...
      const result = await this.exchange.privateGetAccount();
      return result;
    }
  }

  // Sub-class this to implement exchange specific method
  public async getStats() {
    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.stats.${datetime}.json`);
    let data = "";
    if (this.exchangeName === "ftx") {
      data = JSON.stringify(
        // this.exchange.fetchFundingFees({
        this.exchange.publicGetFuturesFutureNameStats({
          future_name: this.symbol,
        })
      );
    } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
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
    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.methods.${datetime}.json`);
    const data = Object.keys(this.exchange).join("\n").toString();
    fs.writeFile(filename, data, function (err) {
      if (err) return console.log(err);
    });
  }

  public async getMarkets() {
    const markets = await this.exchange.loadMarkets();
    const datetime = dateFormat(new Date(), this.dateFormatString);
    const filename = path.join(this.tempDir, `${this.exchangeName}.market.${datetime}.json`);
    fs.writeFile(filename, JSON.stringify(markets), function (err) {
      if (err) return console.log(err);
    });
  }
}
