import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useState } from "react";
import { useAsync } from "../../hooks/useApi";
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
    const rarityParam = rarity ? ` !rarity:"${rarity}"` : "";
    const typesParam = type ? ` types:${type}` : "";
    const query = `name:${name}*${typesParam}${rarityParam}`;

    setSearchTerm(newTerms);

    if (areAllSearchTermsCleared) return [];

    return await PokemonTCG.findCardsByQueries({ pageSize: 20, q: query });
  };

  return useAsync(searchFilterHandler);
};
