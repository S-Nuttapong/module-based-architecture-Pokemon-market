import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { ChangeEventHandler } from "react";

export interface IPokemonCard extends PokemonTCG.Card { }

export type PokemonQueryParameters = PokemonTCG.Parameter

export type InputChangeHandler = ChangeEventHandler<HTMLInputElement>