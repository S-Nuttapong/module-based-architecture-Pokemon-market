import { IInventory } from "../@types/pokemonCard";

const HackOutOfStockConfig = {
    outOfStockChance: 0.2,
}

/**
 * temporary class to help define the product out of stock, so we can demonstrate disabled add to cart button 
 * @todo check with business and design team, if we should expose the card inventory / stock at real time, 
 * @todo if the real time need, we may need to discuss with BE about the possibility to adopt web socket, then we may re-assess the rendering pattern again, atm, it is ISR for web-vital and SEO benefit
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

    private trackHackPriceRecord(id: string, generatedPrice: IInventory) {
        this.record[id] = generatedPrice
    }

    public populateAndTrackPrice<T extends { id: string }>(data: T[]): (T & IInventory)[] {
        return data.map(d => {
            const hackPriceData = { isOutOfStock: this.generateOutOfStock() }
            this.trackHackPriceRecord(d.id, hackPriceData)
            return { ...d, ...hackPriceData }
        })
    }

    public poplulatePrice<T extends { id: string }>(data: T[]): (T & IInventory)[] {
        return data.map(d => {
            const hackPrice = this.record[d.id] || { isOutOfStock: false }
            return { ...d, ...hackPrice }
        })
    }

    public getRecord() {
        return { ...this.record }
    }
}