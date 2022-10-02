import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export interface IPokemonCard extends PokemonTCG.Card { }

export type PokemonQueryParameters = PokemonTCG.Parameter
