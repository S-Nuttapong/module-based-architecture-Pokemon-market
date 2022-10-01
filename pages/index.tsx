import type { NextPage, GetServerSideProps } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Image from "next/image";
import {
  Box,
  Button,
  color,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { NamedAPIResource, PokemonClient } from "pokenode-ts"; // import the PokemonClient (EggGroups enum is fully optional)
import { PokemonCard } from "../types";

//search: GET https://api.pokemontcg.io/v2/cards

//rarity: getGrowthRateByName

const pokemonService = {
  getAll: async (params?: PokemonTCG.Parameter) => {
    const { data: results } = await axios({
      url: "https://api.pokemontcg.io/v2/cards",
      method: "get",
      params,
    });
    return results.data as PokemonCard[];
  },
};

const PokemonSearch = () => (
  <HStack>
    <Input w="173px" placeholder="Search by name" />
    <Button bg="bg.button">Cart</Button>
  </HStack>
);

const PokemonFilter = () => (
  <HStack spacing="16px">
    <Select minW="max-content" color="content.primary" placeholder="Set" />
    <Select minW="max-content" color="content.primary" placeholder="Rarity" />
    <Select minW="max-content" color="content.primary" placeholder="Type" />
  </HStack>
);

interface IPokemonCardList {
  pokemonList: PokemonCard[];
}

const PokemonCardsList = ({ pokemonList }: IPokemonCardList) => (
  <Grid
    gridTemplateColumns="repeat(auto-fill, minmax(150px,1fr) )"
    columnGap="16px"
    rowGap="26px"
  >
    {pokemonList.map((pokemon) => (
      <GridItem key={pokemon.name} color="content.primary">
        <PokemonCard {...pokemon} />
      </GridItem>
    ))}
  </Grid>
);

const Home = () => {
  const [pokemonList, setPokemon] = useState([] as PokemonCard[]);

  useEffect(() => {
    (async () => {
      const params: PokemonTCG.Parameter = { page: 1, pageSize: 20 };
      try {
        const cards = await pokemonService.getAll(params);
        setPokemon(cards);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Flex
      bg="bg.primary"
      minH="100vh"
      w="100vw"
      justifyContent="center"
      px="123px"
    >
      <Stack w="100%" padding="30px" spacing="24px">
        {/* Main */}
        <Flex w="100%" justifyContent="space-between">
          <Heading color="content.primary">Pokemon market</Heading>
          <PokemonSearch />
        </Flex>

        <Divider color="border.divider" />

        {/* filter */}
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <PokemonFilter />
        </Flex>

        {/* Product card list */}
        <PokemonCardsList pokemonList={pokemonList} />
      </Stack>
    </Flex>
  );
};

export default Home;
