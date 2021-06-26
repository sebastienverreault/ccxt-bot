import { Market } from "ccxt";
import { IMarketFilter } from "./IMarketFilter";
import { MarketFilterHelper } from "./MarketFilterHelper";

const FILTER_VALUES = ["BTC"];
const FILTER_PROPERTIES = ["base", "quote"]

export class IsBtc implements IMarketFilter {
    applyFilter(markets: Market[]): Market[] {
        return MarketFilterHelper.applyOrEqualFilter(markets, FILTER_PROPERTIES, FILTER_VALUES);
    }
}
