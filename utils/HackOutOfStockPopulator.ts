import { IInventory } from "../@types/pokemonCard";

const HackOutOfStockConfig = {
    outOfStockChance: 0.2,
}

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