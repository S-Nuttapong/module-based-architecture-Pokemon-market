import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import merge from "lodash/merge";
import { isFalsy } from "../../utils/common";

//name search do wild card
//types search do nothing
//rarity do exact match
export const useSearchFilter = () => {
  const [searchTerms, setSearchTerm] = useState({
    set: "",
    rarity: "",
    type: "",
    name: "",
  });

  const searchFilterHandler = async (terms: Partial<typeof searchTerms>) => {
    const newTerms = merge({}, searchTerms, terms);
    const { name, set, rarity, type } = newTerms;
    const areAllSearchTermsCleared = [name, set, rarity, type].every(isFalsy);
    const rarityQuery = rarity ? `!rarity:"${rarity}"` : "";
    const typesQuery = type ? `types:${type}` : "";
    const setQuery = set ? `set.id:${set}` : ""
    const nameQuery = name ? `name:${name}*` : ""
    const allQueries = [nameQuery, setQuery, typesQuery, rarityQuery]
    const query = [nameQuery, setQuery, typesQuery, rarityQuery].join(' ').trim()

    setSearchTerm(newTerms);

    if (areAllSearchTermsCleared) return [];

    return await PokemonTCG.findCardsByQueries({ pageSize: 20, q: query });
  };

  return useApi(searchFilterHandler);
};


