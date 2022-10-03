import {
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { IPokemonCard, PokemonQueryParameters } from "../@types/pokemonAPIs";

import { useSearchFilter } from "../modules/search-filter/useSearchFilter";

import { isNonEmptyArray } from "../utils/common";
import React from "react";
import { usePokemonCartStore } from "../stores/cart";

import { PokemonFilter } from "../modules/search-filter/Filter";
import { MiniCart } from "../modules/mini-cart/MiniCart";
import { PokemonCardsList } from "../modules/product-card/ProductCardsList";
import { Search } from "../modules/search-filter/Search";

const pokemonService = {
  getAll: async (params?: PokemonQueryParameters) => {
    const { data: results } = await axios({
      url: "https://api.pokemontcg.io/v2/cards",
      method: "get",
      params,
    });
    return results.data as IPokemonCard[];
  },
};

const Home = () => {
  const [pokemonList, setPokemon] = useState([] as IPokemonCard[]);
  const initializeCart = usePokemonCartStore((state) => state.initializeCart);
  const fetchPokemonList = async () => {
    const params: PokemonQueryParameters = { page: 1, pageSize: 20 };
    try {
      const cards = await pokemonService.getAll(params);
      setPokemon(cards);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPokemonList();
    initializeCart();
  }, []);

  const [data, searchFilter] = useSearchFilter();

  return (
    <Flex
      bg="bg.primary"
      minH="100vh"
      w="100vw"
      justifyContent="center"
      px="123px"
    >
      <Stack w="100%" padding="30px" spacing="24px">
        <Flex w="100%" justifyContent="space-between">
          <Heading color="content.primary">Pokemon market</Heading>
          <HStack>
            <Search onSearch={(name) => searchFilter({ name })} />
            <MiniCart />
          </HStack>
        </Flex>

        <Divider borderColor="border.primary" />

        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <PokemonFilter onFilter={(value) => searchFilter(value)} />
        </Flex>

        {data.isLoading ? (
          <Spinner />
        ) : (
          <PokemonCardsList
            pokemonList={
              isNonEmptyArray(data.results) ? data.results : pokemonList
            }
          />
        )}
      </Stack>
    </Flex>
  );
};

export default Home;
