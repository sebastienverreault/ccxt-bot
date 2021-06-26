import { Market } from "ccxt";

export interface IMarketFilter {
    applyFilter(markets: Market[]): Market[];
}
