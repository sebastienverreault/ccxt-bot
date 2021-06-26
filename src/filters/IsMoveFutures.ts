import { Market } from "ccxt";
import { IMarketFilter } from "./IMarketFilter";
import { MarketFilterHelper } from "./MarketFilterHelper";

const FILTER_VALUES = ["MOVE"];
const FILTER_PROPERTIES = ["symbol"]

export class IsMoveFutures implements IMarketFilter {
    applyFilter(markets: Market[]): Market[] {
        return MarketFilterHelper.applyOrNotIncludesFilter(markets, FILTER_PROPERTIES, FILTER_VALUES);
    }
}
