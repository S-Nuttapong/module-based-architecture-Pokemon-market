import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import merge from "lodash/merge";
import { isFalsy } from "../../utils/common";
import { pokemonCardServices } from "../../services/pokemon-card-services/pokemonCardServices";

const findCardsDI = pokemonCardServices.findCardsByQueries

//name search do wild card
//types search do nothing
//rarity do exact match
export const useSearchFilter = (findCards = findCardsDI) => {
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
    const query = [nameQuery, setQuery, typesQuery, rarityQuery].join(' ').trim()

    setSearchTerm(newTerms);

    if (areAllSearchTermsCleared) return [];

    return await findCards({ pageSize: 20, q: query });
  };

  return useApi(searchFilterHandler);
};


