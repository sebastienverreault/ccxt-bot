import { Market } from "ccxt";

export class MarketFilterHelper {
    private static equal(filterValue: string, propertyValue: string): boolean {
        return propertyValue === filterValue;
    }
    private static includes(filterValue: string, propertyValue: string): boolean {
        return propertyValue.includes(filterValue);
    }
    private static notIncludes(filterValue: string, propertyValue: string): boolean {
        return !propertyValue.includes(filterValue);
    }

    private static filter(markets: Market[], properties: string[], values: string[], predicate: (a: string, b: string) => boolean): Market[] {
        const filtredMarkets: Market[] = [];
        markets.forEach((market) => {
            for (const property in properties) {
                const propertyName = properties[property]
                const propertyValue = market[propertyName];
                // if (value !== undefined && values?.includes(value)) {
                if (propertyValue !== undefined) {
                    // if (values.some((value) => { return value === propertyValue.toString() })) {
                    if (values.some((value) => { return predicate(value, propertyValue.toString()); })) {
                        filtredMarkets.push(market);
                        break;
                    }
                }
            }
        });
        return filtredMarkets;
    }

    public static applyOrEqualFilter(markets: Market[], properties: string[], values: string[]): Market[] {
        return MarketFilterHelper.filter(markets, properties, values, MarketFilterHelper.equal);
    }

    public static applyOrIncludesFilter(markets: Market[], properties: string[], values: string[]): Market[] {
        return MarketFilterHelper.filter(markets, properties, values, MarketFilterHelper.includes);
    }

    public static applyOrNotIncludesFilter(markets: Market[], properties: string[], values: string[]): Market[] {
        return MarketFilterHelper.filter(markets, properties, values, MarketFilterHelper.notIncludes);
    }
}
