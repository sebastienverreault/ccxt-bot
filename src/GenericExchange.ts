import ccxt, { ExchangeId, Order } from "ccxt"
import { sleep } from "./utils"
import fs from "fs"
import dateFormat from "dateformat"
import path from "path"

const DATE_FORMAT_STRING = "yyyymmdd.HHMMss"
const TEMP_DIR = "temp-data"

export class ApiConfig {
  constructor(
    public apiKey: string | undefined,
    public secret: string | undefined,
    public password: string | undefined,
  ) {}
}

export enum SupportedExchanges {
  FTX = "ftx",
  OKEX = "okex5",
}

export class GenericExchange {
  dateFormatString
  tempDir
  exchangeName
  exchange
  symbol

  // public ccxt;

  constructor(exchangeName: string, apiConfig: ApiConfig, symbol: string) {
    this.dateFormatString = DATE_FORMAT_STRING
    this.tempDir = TEMP_DIR
    this.exchangeName = exchangeName
    this.symbol = symbol
    const exchangeId = this.exchangeName as ExchangeId
    const exchangeClass = ccxt[exchangeId]
    this.exchange = new exchangeClass({
      apiKey: apiConfig.apiKey,
      secret: apiConfig.secret,
      password: apiConfig.password,
    })
    // this.ccxt = this.exchange;
    console.log(this.exchange.requiredCredentials)
    this.exchange.checkRequiredCredentials()
  }

  public GetSymbol() {
    // Should resolve best instrument to used given the exchange and the market conditions.
    const optimalSymbol = this.symbol
    this.symbol = optimalSymbol
    return this.symbol
  }

  public has() {
    const has = this.exchange.has
    this.writeFile(has, "has")
    return has
  }

  public has2() {
    const has = this.exchange.has
    return has
  }

  public name() {
    const name = this.exchange.name
    return name
  }

  async fetchDepositAddress(currency: string) {
    const address = await this.exchange.fetchDepositAddress(currency)
    this.writeFile(address, "deposit.address")
    return address
  }

  public async withdraw(currency: string, amount: number, address: string) {
    const withdrawalResult = await this.exchange.withdraw(currency, amount, address)
    return withdrawalResult
  }

  public async createOrder(
    symbol: string,
    type: Order["type"],
    side: Order["side"],
    amount: number,
  ) {
    const order = await this.exchange.createOrder(symbol, type, side, amount)
    return order
  }

  public async fetchOrder(id: string) {
    const order = await this.exchange.fetchOrder(id, this.symbol)
    return order
  }

  public async getPositions() {
    const positions = await this.exchange.fetchPositions()
    this.writeFile(positions, "positions")
    return positions
  }

  public async fetchBalance() {
    const balances = await this.exchange.fetchBalance()
    this.writeFile(balances, "balances")
    return balances
  }

  public async getBtcSpot() {
    const instrument = await this.getInstrument("BTC", "spot")
    return instrument
  }

  public async getBtcFutures() {
    const instrument = await this.getInstrument("BTC", "future")
    return instrument
  }

  public async getInstrument(base: string, type: string) {
    const markets = await this.exchange.loadMarkets(true)
    let data = ""

    for (const symbol in markets) {
      try {
        if (!symbol.includes("MOVE")) {
          const market = markets[symbol]
          if (market["base"] === base || market["quote"] === base)
            if (market["type"] === type || market["type"] === type + "s") {
              const ticker = await this.exchange.fetchTicker(symbol)
              data += `symbol = ${symbol}\n`
              data += `Market = ${JSON.stringify(market)}\n`
              data += `Ticker = ${JSON.stringify(ticker)}\n`
              await sleep(this.exchange.rateLimit)
            }
        }
      } catch (error) {
        data += `error = ${error}\n`
      }
    }

    this.writeFileRaw(data, type)

    return markets
  }

  public async getNextFundingRate(symbol: string) {
    if (this.exchangeName === "ftx") {
      const arg = { future_name: symbol }
      const result = await this.exchange.publicGetFuturesFutureNameStats(arg)
      this.writeFile(result, "funding.rate")
      return result
    } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
      const arg = { instId: symbol }
      const result = await this.exchange.publicGetPublicFundingRate(arg)
      this.writeFile(result, "funding.rate")
      return result
    }
  }

  public async privateGetAccount() {
    if (this.exchangeName === "ftx") {
      const result = await this.exchange.privateGetAccount()
      return result
    } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
      // following method does not exist...
      const result = await this.exchange.privateGetAccount()
      return result
    }
  }

  // // Sub-class this to implement exchange specific method
  // public async getStats() {
  //   let data = ""
  //   if (this.exchangeName === "ftx") {
  //     data = JSON.stringify(
  //       this.exchange.publicGetFuturesFutureNameStats({
  //         future_name: this.symbol,
  //       }),
  //     )
  //   } else if (this.exchangeName === "okex" || this.exchangeName === "okex5") {
  //     data = JSON.stringify(
  //       this.exchange.publicGetPublicFundingRate({
  //         future_name: this.symbol,
  //       }),
  //     )
  //   }
  //   this.writeFileRaw(data, "stats")
  // }

  public async getMethods() {
    const methods = Object.keys(this.exchange)
    const data = methods.join("\n").toString()
    this.writeFileRaw(data, "methods")
    return methods
  }

  public async getMarkets() {
    const markets = await this.exchange.loadMarkets()
    this.writeFile(markets, "market")
    return markets
  }

  private writeFileRaw(rawData, type) {
    const datetime = dateFormat(new Date(), this.dateFormatString)
    const filename = path.join(
      this.tempDir,
      `${this.exchangeName}.${type}.${datetime}.json`,
    )
    fs.writeFile(filename, rawData, function (err) {
      if (err) return console.log(err)
    })
  }

  private writeFile(data, type) {
    this.writeFileRaw(JSON.stringify(data), type)
  }
}
