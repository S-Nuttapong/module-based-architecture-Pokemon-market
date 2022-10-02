import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export interface IPokemonCard extends PokemonTCG.Card {
    price?: number
    isOutOfStock?: boolean
}

export type PokemonQueryParameters = PokemonTCG.Parameter
