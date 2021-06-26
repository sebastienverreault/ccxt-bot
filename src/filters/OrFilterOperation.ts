import { Market } from "ccxt";
import { IMarketFilter } from "./IMarketFilter";
import { MarketFilterHelper } from "./MarketFilterHelper";

export class OrFilterOperation implements IMarketFilter {
    filter1;
    filter2;

    public constructor(filter1: IMarketFilter, filter2: IMarketFilter) {
        this.filter1 = filter1;
        this.filter2 = filter2;
    }

    applyFilter(markets: Market[]): Market[] {
        const filter1Markets = this.filter1.applyFilter(markets);
        const filter2Markets = this.filter2.applyFilter(markets);

        filter2Markets.forEach((market) => {
            if (!filter1Markets.includes(market)) {
                filter2Markets.push(market);
            }
        });

        return filter1Markets;
    }
}
