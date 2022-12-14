import axios from "axios";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { IPokemonCard } from "../@types/pokemonCard";

export type PokemonCardParameters = PokemonTCG.Parameter;

/**
 * wrapper for pokemon card services built on top 3rd party with more up to date type
 * @todo create interface for services, then gradually implement our services base on the official doc, and essentially opt out of the 3rd party lib, as the type is a bit out date
 * @see https://docs.pokemontcg.io/api-reference/cards/search-cards
 */
export const pokemonCardServices = {
  ...PokemonTCG,
  findCardsByQueries: async (
    params: PokemonCardParameters
  ): Promise<IPokemonCard[]> =>
    (await PokemonTCG.findCardsByQueries(params)) as IPokemonCard[],
  getAll: async (params?: PokemonCardParameters) => {
    const { data: results } = await axios({
      url: "https://api.pokemontcg.io/v2/cards",
      method: "get",
      params,
    });
    return results.data as IPokemonCard[];
  },
};
