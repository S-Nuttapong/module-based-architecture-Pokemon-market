import { ICartMarket, IInventory, IPokemonCard } from "../@types/pokemonCard";

const HackOutOfStockConfig = {
    outOfStockChance: 0.3,
    stubCardMarket: {
        prices: {
            "averageSellPrice": 0.1,
            "lowPrice": 0.02,
            "trendPrice": 0.1,
            "reverseHoloSell": 0.38,
            "reverseHoloLow": 0.09,
            "reverseHoloTrend": 0.62,
            "lowPriceExPlus": 0.03,
            "avg1": 0.1,
            "avg7": 0.09,
            "avg30": 0.08,
            "reverseHoloAvg1": 0.1,
            "reverseHoloAvg7": 0.64,
            "reverseHoloAvg30": 0.42
        }
    } as ICartMarket
}


/**
 * temporary class to help define the product out of stock, so we can demonstrate disabled add to cart button.
 * For the purpose of e2e testing, we will intentionally preserve the first 2 cards, you may uses the first 2 items to assert total price 
 * @todo check with business and design team, if we should expose the card inventory / stock at real time, 
 * @todo if the real time need, we may need to discuss with BE about the possibility to adopt web socket, then we may re-assess the rendering pattern again, atm, it is ISR for web-vital and SEO benefit
 * @todo apply builder pattern, expose the configs in build steps: HackOutOfStockPoputatorBuilder.changeOfOutOfStock(number).fallbackPrice(ICartMarket).build() 
 */
export class HackOutOfStockPoputator {
    private record: Record<string, IInventory>
    private configs: typeof HackOutOfStockConfig

    constructor(record = {} as Record<string, IInventory>, configs = HackOutOfStockConfig) {
        this.record = record
        this.configs = configs
    }

    private generateOutOfStock() {
        return Math.random() < this.configs.outOfStockChance
    }

    private trackHackPriceRecord(id: string, generatedPrice: IInventory & { cardmarket: ICartMarket }) {
        this.record[id] = generatedPrice
    }

    public populateAndTrackPrice(data: IPokemonCard[]): (IPokemonCard & IInventory)[] {
        return data.map((d, idx) => {
            const cardmarket = d.cardmarket || HackOutOfStockConfig.stubCardMarket
            const hackPriceData = { isOutOfStock: idx > 1 && this.generateOutOfStock(), cardmarket }
            this.trackHackPriceRecord(d.id, hackPriceData)
            return { ...d, ...hackPriceData }
        })
    }

    //When doing filtering we will lose the out of stock associate to each cart, so we need this 
    public poplulatePrice(data: IPokemonCard[]): (IPokemonCard & IInventory)[] {
        return data.map(d => {
            const hackPrice = this.record[d.id] || { isOutOfStock: false }
            return { ...d, ...hackPrice }
        })
    }

    public getRecord() {
        return { ...this.record }
    }
}