import { Market } from "ccxt";
import { IMarketFilter } from "./IMarketFilter";
import { MarketFilterHelper } from "./MarketFilterHelper";

export class AndFilterOperation implements IMarketFilter {
    filter1;
    filter2;

    public constructor(filter1: IMarketFilter, filter2: IMarketFilter) {
        this.filter1 = filter1;
        this.filter2 = filter2;
    }

    applyFilter(markets: Market[]): Market[] {
        return this.filter1.applyFilter(this.filter2.applyFilter(markets));
    }
}
