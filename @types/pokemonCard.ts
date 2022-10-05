import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export interface IInventory {
  isOutOfStock: boolean;
  inventory?: number;
}

export interface ICardMarketPrices {
  url: string;
  updatedAt: string;
  averageSellPrice: number;
  lowPrice: number;
  trendPrice: number;
  reverseHoloSell: number;
  reverseHoloLow: number;
  reverseHoloTrend: number;
  lowPriceExPlus: number;
  avg1: number;
  avg7: number;
  avg30: number;
  reverseHoloAvg1: number;
  reverseHoloAvg7: number;
  reverseHoloAvg30: number;
}

export interface ICartMarket {
  prices: ICardMarketPrices
}

export interface IPokemonCard extends PokemonTCG.Card, IInventory {
  cardmarket: ICartMarket;
}
