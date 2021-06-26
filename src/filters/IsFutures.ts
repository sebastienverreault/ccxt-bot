import { Market } from "ccxt";
import { IMarketFilter } from "./IMarketFilter";
import { MarketFilterHelper } from "./MarketFilterHelper";

const FILTER_VALUES = ['FUTURE', 'FUTURES'];
const FILTER_PROPERTIES = ["type"]

export class IsFutures implements IMarketFilter {
    applyFilter(markets: Market[]): Market[] {
        return MarketFilterHelper.applyOrEqualFilter(markets, FILTER_PROPERTIES, FILTER_VALUES);
    }
}
