import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import merge from "lodash/merge";
import { isFalsy, isNonEmptyArray } from "../../utils/common";
import { pokemonCardServices } from "../../services/pokemonCardServices";
import { IPokemonCard } from "../../@types/pokemonCard";

const makeSearchQuery = (searchTerms: typeof INITIAL_SEARCH_TERMS) => {
  const { name, set, rarity, type } = searchTerms;
  const rarityQuery = rarity ? `!rarity:"${rarity}"` : "";
  const typesQuery = type ? `types:${type}` : "";
  const setQuery = set ? `set.id:${set}` : ""
  const nameQuery = name ? `name:${name}*` : ""
  const query = [nameQuery, setQuery, typesQuery, rarityQuery].join(' ').trim()

  return query
}

const DEFAULT_CONFIGS = {
  makeSearchQuery: makeSearchQuery,
  findCards: pokemonCardServices.findCardsByQueries
}

const INITIAL_SEARCH_TERMS = {
  set: "",
  rarity: "",
  type: "",
  name: "",
}

export enum SearchStatus {
  Cleared,
  Found,
  NotFound
}

type SearchResults = {
  status: SearchStatus.Cleared
} | { status: SearchStatus.NotFound, data: [] } | { status: SearchStatus.Found, data: IPokemonCard[] }

export const useSearchFilter = (configs?: typeof DEFAULT_CONFIGS) => {
  const [searchTerms, setSearchTerm] = useState(INITIAL_SEARCH_TERMS);
  const { makeSearchQuery, findCards } = { ...configs, ...DEFAULT_CONFIGS }

  const searchFilterHandler = async (terms: Partial<typeof searchTerms>): Promise<SearchResults> => {
    const newTerms = merge({}, searchTerms, terms);
    const { name, set, rarity, type } = newTerms;
    const areAllSearchTermsCleared = [name, set, rarity, type].every(isFalsy);

    setSearchTerm(newTerms);

    if (areAllSearchTermsCleared) return { status: SearchStatus.Cleared };

    const query = makeSearchQuery(newTerms)

    const data = await findCards({ pageSize: 20, q: query });

    if (isNonEmptyArray(data)) return { data, status: SearchStatus.Found }

    return { status: SearchStatus.NotFound, data: [] }
  };

  return useApi(searchFilterHandler);
};


