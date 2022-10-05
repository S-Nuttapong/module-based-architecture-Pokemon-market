import { IPrice } from "../services/pokemon-cards/pokemonCardServices";

const HackPriceConfig = {
    outOfStockChance: 0.2,
    price: 2.29
}

export class HackPricePoputator {
    private record: Record<string, IPrice>
    private configs: typeof HackPriceConfig

    constructor(record = {} as Record<string, IPrice>, configs = HackPriceConfig) {
        this.record = record
        this.configs = configs
    }

    private generateOutOfStock() {
        return Math.random() < this.configs.outOfStockChance
    }

    private trackHackPriceRecord(id: string, generatedPrice: IPrice) {
        this.record[id] = generatedPrice
    }

    public populateAndTrackPrice<T extends { id: string }>(data: T[]): (T & IPrice)[] {
        return data.map(d => {
            const hackPriceData = { price: this.configs.price, isOutOfStock: this.generateOutOfStock() }
            this.trackHackPriceRecord(d.id, hackPriceData)
            return { ...d, ...hackPriceData }
        })
    }

    public poplulatePrice<T extends { id: string }>(data: T[]): (T & IPrice)[] {
        return data.map(d => {
            const hackPrice = this.record[d.id] || { price: this.configs.price, isOutOfStock: false }
            return { ...d, ...hackPrice }
        })
    }

    public getRecord() {
        return { ...this.record }
    }
}