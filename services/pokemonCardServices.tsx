import axios from "axios";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export interface IPokemonCard extends PokemonTCG.Card {
  price?: number;
  isOutOfStock?: boolean;
}

export type PokemonCardParameters = PokemonTCG.Parameter;

export const pokemonCardServices = {
  ...PokemonTCG,
  getAll: async (params?: PokemonCardParameters) => {
    const { data: results } = await axios({
      url: "https://api.pokemontcg.io/v2/cards",
      method: "get",
      params,
    });
    return results.data as IPokemonCard[];
  },
};
