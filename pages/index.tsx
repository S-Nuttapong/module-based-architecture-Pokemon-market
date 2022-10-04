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
import { PokemonCardGrid } from "../modules/product-card/ProductCardGrid";
import { ISearch, Search } from "../modules/search-filter/Search";

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

const DesktopSearch = (props: ISearch) => (
  <Search w="fit-content" {...props} display={["none", "none", "flex"]} />
);

const MobileSearch = (props: ISearch) => (
  <Search w="100%" {...props} display={["flex", "flex", "none"]} />
);

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
      px={[0, "30px", "60px", "120px"]}
    >
      <Stack w="100%" padding={["20px", "20px", "30px", "30px"]} spacing="24px">
        <HStack w="100%" justifyContent="space-between">
          <Heading
            color="content.primary"
            minW="max-content"
            fontSize="26px"
            fontWeight="600"
          >
            Pokemon market
          </Heading>
          <HStack w="100%" justifyContent="flex-end" alignItems="baseline">
            <DesktopSearch onSearch={(name) => searchFilter({ name })} />
            <MiniCart />
          </HStack>
        </HStack>

        <MobileSearch onSearch={(name) => searchFilter({ name })} />

        <Divider borderColor="border.primary" />

        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="24px"
        >
          <Text color="content.primary" fontSize="18px" fontWeight="600">
            Choose Card
          </Text>
          <PokemonFilter onFilter={(value) => searchFilter(value)} />
        </Flex>

        {data.isLoading ? (
          <Spinner />
        ) : (
          <PokemonCardGrid
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
