import ccxt, { ExchangeId, Order } from "ccxt"
import { sleep } from "./utils"
import fs from "fs"
import dateFormat from "dateformat"
import path from "path"

const DATE_FORMAT_STRING = "yyyymmdd.HHMMss"
const TEMP_DIR = "temp-data"

export enum SupportedExchanges {
  FTX = "ftx",
  OKEXv3 = "okex",
  OKEXv5 = "okex5",
}

export class ApiConfig {
  constructor(
    public exchangeId: SupportedExchanges | undefined,
    public apiKey: string | undefined,
    public secret: string | undefined,
    public password: string | undefined,
  ) {
    this.exchangeId = exchangeId
  }
}

export class GenericExchange {
  dateFormatString
  tempDir
  exchangeId: ExchangeId
  exchange
  defaultSymbol

  static ftxDefaultSymbol = "BTC-PERP"
  static ftxDefaultSpotSymbol = "BTC/USD"
  static ftxDefaultSwapSymbol = "BTC-PERP"
  static okexOldSymbol = "BTC-USD-210702"
  static okexDefaultSymbol = "BTC-USD-211231"
  static okexDefaultSpotSymbol = "BTC/USDT"
  static okexDefaultSwapSymbol = "BTC-USD-SWAP"

  constructor(apiConfig: ApiConfig) {
    this.dateFormatString = DATE_FORMAT_STRING
    this.tempDir = TEMP_DIR
    this.exchangeId = apiConfig.exchangeId as ExchangeId
    const exchangeClass = ccxt[this.exchangeId]
    this.exchange = new exchangeClass({
      apiKey: apiConfig.apiKey,
      secret: apiConfig.secret,
      password: apiConfig.password,
    })
    console.log(this.exchange.requiredCredentials)
    this.exchange.checkRequiredCredentials()
  }

  public GetSymbol() {
    // TODO: Should resolve best instrument to used given the exchange and the market conditions.
    // const optimalSymbol = this.getOptimalSymbol;
    // this.defaultSymbol = optimalSymbol;

    if (this.exchangeId === SupportedExchanges.FTX) {
      this.defaultSymbol = GenericExchange.ftxDefaultSymbol
    } else if (this.exchangeId === SupportedExchanges.OKEXv3) {
      this.defaultSymbol = GenericExchange.okexDefaultSymbol
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      this.defaultSymbol = GenericExchange.okexDefaultSymbol
    }

    return this.defaultSymbol
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
    const order = await this.exchange.fetchOrder(id, this.defaultSymbol)
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

  public async fetchMyTrades_old() {
    if (this.exchangeId === SupportedExchanges.FTX) {
      let symbol = GenericExchange.ftxDefaultSwapSymbol
      let myTrades = await this.exchange.fetchMyTrades(symbol)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      symbol = GenericExchange.ftxDefaultSpotSymbol
      myTrades = await this.exchange.fetchMyTrades(symbol)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      return myTrades
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      try {
        const symbol = GenericExchange.okexOldSymbol
        const myTrades = await this.exchange.fetchMyTrades(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexOldSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSymbol
        const myTrades = await this.exchange.fetchMyTrades(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexDefaultSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSpotSymbol
        const myTrades = await this.exchange.fetchMyTrades(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(
          `Error in fetchMyTrades(${GenericExchange.okexDefaultSpotSymbol})`,
          error,
        )
      }
    }
  }

  public async fetchMyTrades_old2() {
    if (this.exchangeId === SupportedExchanges.FTX) {
      let symbol = GenericExchange.ftxDefaultSwapSymbol
      let myTrades = await this.fetchMyTradesAllPages(symbol)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      symbol = GenericExchange.ftxDefaultSpotSymbol
      myTrades = await this.fetchMyTradesAllPages(symbol)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      return myTrades
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      try {
        const symbol = GenericExchange.okexOldSymbol
        const myTrades = await this.fetchMyTradesAllPages(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexOldSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSymbol
        const myTrades = await this.fetchMyTradesAllPages(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexDefaultSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSpotSymbol
        const myTrades = await this.fetchMyTradesAllPages(symbol)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(
          `Error in fetchMyTrades(${GenericExchange.okexDefaultSpotSymbol})`,
          error,
        )
      }
    }
  }

  public async fetchMyTrades(since) {
    if (this.exchangeId === SupportedExchanges.FTX) {
      let symbol = GenericExchange.ftxDefaultSwapSymbol
      let myTrades = await this.fetchMyTradesSince(symbol, since)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      symbol = GenericExchange.ftxDefaultSpotSymbol
      myTrades = await this.fetchMyTradesSince(symbol, since)
      this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)

      return myTrades
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      try {
        const symbol = GenericExchange.okexOldSymbol
        const myTrades = await this.fetchMyTradesSince(symbol, since)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexOldSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSymbol
        const myTrades = await this.fetchMyTradesSince(symbol, since)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(`Error in fetchMyTrades(${GenericExchange.okexDefaultSymbol})`, error)
      }

      try {
        const symbol = GenericExchange.okexDefaultSpotSymbol
        const myTrades = await this.fetchMyTradesSince(symbol, since)
        this.writeFile(myTrades, `myTrades-${symbol.replace("/", "-")}`)
      } catch (error) {
        console.log(
          `Error in fetchMyTrades(${GenericExchange.okexDefaultSpotSymbol})`,
          error,
        )
      }
    }
  }

  // fetchDeposits
  public async fetchDeposits(since) {
    // const deposits = await this.exchange.fetchDeposits()
    const deposits = await this.fetchDepositsSince(since)
    this.writeFile(deposits, "deposits")
    return deposits
  }

  // fetchWithdrawals
  public async fetchWithdrawals(since) {
    // const withdrawals = await this.exchange.fetchWithdrawals()
    const withdrawals = await this.fetchWithdrawalsSince(since)
    this.writeFile(withdrawals, "withdrawals")
    return withdrawals
  }

  private async fetchTradesAllPages(symbol) {
    let page = 0 // exchange-specific type and value
    const allTrades: any[] = []
    const one = true
    while (one) {
      const since = undefined
      const limit = 100
      const params = {
        page: page, // exchange-specific non-unified parameter name
      }
      const trades = await this.exchange.fetchTrades(symbol, since, limit, params)
      if (trades.length) {
        // not thread-safu and exchange-specific !
        page = this.exchange.last_json_response["cursor"]
        console.log(`Got fetchTrades() page=${page}`)
        allTrades.push(trades)
        if (!page) {
          break
        }
      } else {
        break
      }
    }
    return allTrades
  }

  private async fetchTradesSince(symbol, msSince) {
    let since = msSince
    let allTrades = []
    while (since < this.exchange.milliseconds()) {
      const limit = 100
      const trades = await this.exchange.fetchTrades(symbol, since, limit)
      if (trades.length) {
        since = trades[trades.length - 1]["timestamp"] + 1
        allTrades = allTrades.concat(trades)
      } else {
        break
      }
    }
    return allTrades
  }

  private async fetchMyTradesAllPages(symbol) {
    let page = 0 // exchange-specific type and value
    const allMyTrades: any[] = []
    const one = true
    while (one) {
      const since = undefined
      const limit = 100
      const params = {
        page: page, // exchange-specific non-unified parameter name
      }
      const trades = await this.exchange.fetchMyTrades(symbol, since, limit, params)
      if (trades.length) {
        // not thread-safu and exchange-specific !
        page = this.exchange.last_json_response["cursor"]
        console.log(`Got fetchMyTrades() page=${page}`)
        allMyTrades.push(trades)
        if (!page) {
          break
        }
      } else {
        break
      }
    }
    return allMyTrades
  }

  private async fetchMyTradesSince(symbol, msSince) {
    let since = msSince
    let allMyTrades = []
    while (since < this.exchange.milliseconds()) {
      const limit = 100
      const trades = await this.exchange.fetchMyTrades(symbol, since, limit)
      if (trades.length) {
        since = trades[trades.length - 1]["timestamp"] + 1
        allMyTrades = allMyTrades.concat(trades)
      } else {
        break
      }
    }
    return allMyTrades
  }

  private async fetchDepositsAllPages() {
    let page = 0 // exchange-specific type and value
    const allDeposits: any[] = []
    const one = true
    while (one) {
      const code = undefined
      const since = undefined
      const limit = 100
      const params = {
        page: page, // exchange-specific non-unified parameter name
      }
      const trades = await this.exchange.fetchDeposits(code, since, limit, params)
      if (trades.length) {
        // not thread-safu and exchange-specific !
        page = this.exchange.last_json_response["cursor"]
        console.log(`Got fetchDeposits() page=${page}`)
        allDeposits.push(trades)
        if (!page) {
          break
        }
      } else {
        break
      }
    }
    return allDeposits
  }

  private async fetchDepositsSince(msSince) {
    let since = msSince
    let allDeposits = []
    while (since < this.exchange.milliseconds()) {
      const code = undefined
      const limit = 100
      const trades = await this.exchange.fetchDeposits(code, since, limit)
      if (trades.length) {
        since = trades[trades.length - 1]["timestamp"] + 1
        allDeposits = allDeposits.concat(trades)
      } else {
        break
      }
    }
    return allDeposits
  }

  private async fetchWithdrawalsAllPages() {
    let page = 0 // exchange-specific type and value
    const allWithdrawals: any[] = []
    const one = true
    while (one) {
      const code = undefined
      const since = undefined
      const limit = 100
      const params = {
        page: page, // exchange-specific non-unified parameter name
      }
      const trades = await this.exchange.fetchWithdrawals(code, since, limit, params)
      if (trades.length) {
        // not thread-safu and exchange-specific !
        page = this.exchange.last_json_response["cursor"]
        console.log(`Got fetchWithdrawals() page=${page}`)
        allWithdrawals.push(trades)
        if (!page) {
          break
        }
      } else {
        break
      }
    }
    return allWithdrawals
  }

  private async fetchWithdrawalsSince(msSince) {
    let since = msSince
    let allWithdrawals = []
    while (since < this.exchange.milliseconds()) {
      const code = undefined
      const limit = 100
      const trades = await this.exchange.fetchWithdrawals(code, since, limit)
      if (trades.length) {
        since = trades[trades.length - 1]["timestamp"] + 1
        allWithdrawals = allWithdrawals.concat(trades)
      } else {
        break
      }
    }
    return allWithdrawals
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
    if (this.exchangeId === SupportedExchanges.FTX) {
      const arg = { future_name: symbol }
      const result = await this.exchange.publicGetFuturesFutureNameStats(arg)
      this.writeFile(result, "funding.rate")
      return result
    } else if (this.exchangeId === SupportedExchanges.OKEXv3) {
      const arg = { instId: symbol }
      const result = await this.exchange.publicGetPublicFundingRate(arg)
      this.writeFile(result, "funding.rate")
      return result
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      const arg = { instId: symbol }
      const result = await this.exchange.publicGetPublicFundingRate(arg)
      this.writeFile(result, "funding.rate")
      return result
    }
  }

  /**
   *
   * API Ref: https://docs.ftx.com/#account
   *
   * ftx.collateral 	      number 	  3568181.02691129 	    "amount of collateral"
   * ftx.positions 	        array 		                      See Get positions for details
   * ftx.marginFraction 	  number 	  0.5588433331419503 -  ratio between total account value and total account position notional.
   * ftx.totalAccountValue 	number 	  3568180.98341129 	    total value of the account, using mark price for positions
   * ftx.chargeInterestOnNegativeUsd
   *
   * for ref.
   * ftx.totalPositionSize 	number 	  6384939.6992 	        total size of positions held by the account, using mark price
   *
   * for calc.
   * ftx.marginFraction     = ftx.totalAccountValue / ftx.totalPositionSize
   * 0.5588433331419503     = 3568180.98341129      / 6384939.6992          == 0.5588433331419503
   *
   *
   * API Ref: https://www.okex.com/docs-v5/en/#rest-api-account-get-account-and-position-risk
   *
   * ftx.collateral 	      === mgnRatio?
   * ftx.positions 	        === okex.posData 	Array 	Detailed position information in all currencies
   * ftx.marginFraction 	  ===
   * ftx.totalAccountValue 	===
   * ftx.chargeInterestOnNegativeUsd
   *
   *
   * API Ref: https://www.okex.com/docs-v5/en/#rest-api-account-get-balance
   *
   * ftx.collateral 	      === mgnRatio?
   *
   *
   */
  public async privateGetAccount() {
    /* Needs 
        ftx.collateral,
        ftx.positions,
        ftx.chargeInterestOnNegativeUsd,
        ftx.marginFraction,
        ftx.totalAccountValue,
    */
    if (this.exchangeId === SupportedExchanges.FTX) {
      const result = await this.exchange.privateGetAccount()
      this.writeFile(result, "account")
      return result
    } else if (this.exchangeId === SupportedExchanges.OKEXv3) {
      const result = await this.exchange.privateGetAccount()
      this.writeFile(result, "account")
      return result
    } else if (this.exchangeId === SupportedExchanges.OKEXv5) {
      const result = await this.getOkexV5AccountInfo()
      return result
    }
  }

  private async getOkexV5AccountInfo() {
    const privateGetAccountBalance = await this.exchange.privateGetAccountBalance()
    this.writeFile(privateGetAccountBalance, "privateGetAccountBalance")
    const privateGetAccountBills = await this.exchange.privateGetAccountBills()
    this.writeFile(privateGetAccountBills, "privateGetAccountBills")
    const privateGetAccountBillsArchive =
      await this.exchange.privateGetAccountBillsArchive()
    this.writeFile(privateGetAccountBillsArchive, "privateGetAccountBillsArchive")
    const privateGetAccountConfig = await this.exchange.privateGetAccountConfig()
    this.writeFile(privateGetAccountConfig, "privateGetAccountConfig")
    const privateGetAccountMaxSizeIsolated = await this.exchange.privateGetAccountMaxSize(
      {
        instId: GenericExchange.okexDefaultSymbol,
        tdMode: "isolated",
      },
    )
    this.writeFile(privateGetAccountMaxSizeIsolated, "privateGetAccountMaxSizeIsolated")
    // const privateGetAccountMaxSizeCross = await this.exchange.privateGetAccountMaxSize({
    //   instId: GenericExchange.okexDefaultSymbol,
    //   tdMode: "cross",
    // })
    // this.writeFile(privateGetAccountMaxSizeCross, "privateGetAccountMaxSizeCross")
    // const privateGetAccountMaxSizeCash = await this.exchange.privateGetAccountMaxSize({
    //   instId: GenericExchange.okexDefaultSymbol,
    //   tdMode: "cash",
    // })
    // this.writeFile(privateGetAccountMaxSizeCash, "privateGetAccountMaxSizeCash")
    const privateGetAccountMaxAvailSizeIsolated =
      await this.exchange.privateGetAccountMaxAvailSize({
        instId: GenericExchange.okexDefaultSymbol,
        tdMode: "isolated",
      })
    this.writeFile(
      privateGetAccountMaxAvailSizeIsolated,
      "privateGetAccountMaxAvailSizeIsolated",
    )
    const privateGetAccountMaxLoan = await this.exchange.privateGetAccountMaxLoan({
      instId: GenericExchange.okexDefaultSpotSymbol,
      mgnMode: "isolated",
    })
    this.writeFile(privateGetAccountMaxLoan, "privateGetAccountMaxLoan")
    const privateGetAccountMaxWithdrawal =
      await this.exchange.privateGetAccountMaxWithdrawal()
    this.writeFile(privateGetAccountMaxWithdrawal, "privateGetAccountMaxWithdrawal")
    const privateGetAccountInterestAccrued =
      await this.exchange.privateGetAccountInterestAccrued()
    this.writeFile(privateGetAccountInterestAccrued, "privateGetAccountInterestAccrued")
    const privateGetAccountInterestRate =
      await this.exchange.privateGetAccountInterestRate()
    this.writeFile(privateGetAccountInterestRate, "privateGetAccountInterestRate")
    const privateGetAccountLeverageInfoIsolated =
      await this.exchange.privateGetAccountLeverageInfo({
        instId: GenericExchange.okexDefaultSpotSymbol,
        mgnMode: "isolated",
      })
    this.writeFile(
      privateGetAccountLeverageInfoIsolated,
      "privateGetAccountLeverageInfoIsolated",
    )
    const privateGetAccountPositions = await this.exchange.privateGetAccountPositions()
    this.writeFile(privateGetAccountPositions, "privateGetAccountPositions")
    const privateGetAccountAccountPositionRisk =
      await this.exchange.privateGetAccountAccountPositionRisk()
    this.writeFile(
      privateGetAccountAccountPositionRisk,
      "privateGetAccountAccountPositionRisk",
    )
    const privateGetAccountTradeFeeSpot = await this.exchange.privateGetAccountTradeFee({
      instType: "SPOT",
      // instId: GenericExchange.okexDefaultSpotSymbol,
      category: 1,
    })
    this.writeFile(privateGetAccountTradeFeeSpot, "privateGetAccountTradeFeeSpot")
    const privateGetAccountTradeFeeMargin = await this.exchange.privateGetAccountTradeFee(
      {
        instType: "MARGIN",
        category: 1,
      },
    )
    this.writeFile(privateGetAccountTradeFeeMargin, "privateGetAccountTradeFeeMargin")
    const privateGetAccountTradeFeeSwap = await this.exchange.privateGetAccountTradeFee({
      instType: "SWAP",
      category: 1,
    })
    this.writeFile(privateGetAccountTradeFeeSwap, "privateGetAccountTradeFeeSwap")
    const privateGetAccountTradeFeeFutures =
      await this.exchange.privateGetAccountTradeFee({
        instType: "FUTURES",
        category: 1,
      })
    this.writeFile(privateGetAccountTradeFeeFutures, "privateGetAccountTradeFeeFutures")

    return {
      privateGetAccountBalance,
      privateGetAccountBills,
      privateGetAccountBillsArchive,
      privateGetAccountConfig,
      // privateGetAccountMaxSizeCash,
      // privateGetAccountMaxSizeCross,
      privateGetAccountMaxSizeIsolated,
      privateGetAccountMaxAvailSizeIsolated,
      privateGetAccountMaxLoan,
      privateGetAccountMaxWithdrawal,
      privateGetAccountInterestAccrued,
      privateGetAccountInterestRate,
      privateGetAccountLeverageInfoIsolated,
      privateGetAccountPositions,
      privateGetAccountAccountPositionRisk,
      privateGetAccountTradeFeeSpot,
      privateGetAccountTradeFeeMargin,
      privateGetAccountTradeFeeSwap,
      privateGetAccountTradeFeeFutures,
    }
  }

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
      `${this.exchange.name}.${type}.${datetime}.json`,
    )
    fs.writeFile(filename, rawData, function (err) {
      if (err) return console.log(err)
    })
  }

  private writeFile(data, type) {
    this.writeFileRaw(JSON.stringify(data), type)
  }
}
