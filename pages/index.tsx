import type { NextPage, GetServerSideProps } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { IPokemonCard, PokemonQueryParameters } from "../types";
import { PokemonCard } from "../modules/PokemonCard";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { OptionSelect } from "../components/OptionSelect";
import { PokemonNameSearch } from "../modules/PokemonNameSearch";
import { isNonEmptyArray } from "../utils/common";

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

const PokemonCart = () => {
  return <Button bg="bg.button">Cart</Button>;
};

const TypeOptions = Object.entries(PokemonTCG.Type).map(([_, typeValue]) => ({
  value: typeValue,
  label: typeValue,
}));

const RarityOptions = Object.entries(PokemonTCG.Rarity).map(
  ([_, rarityValue]) => ({
    value: rarityValue,
    label: rarityValue,
  })
);

type FilterLabels = "Rarity" | "Type" | "Set";

type FilterTypes = Lowercase<FilterLabels>;

type FilterEventInput = Partial<Record<FilterTypes, string>>;
interface IPokemonFilter {
  onFilter: (input: FilterEventInput) => void;
}

const PokemonFilter = ({ onFilter }: IPokemonFilter) => (
  <HStack spacing="16px">
    <Select minW="max-content" color="content.primary" placeholder="Set" />
    <OptionSelect
      minW="max-content"
      color="content.primary"
      placeholder="Rarity"
      options={RarityOptions}
      onChange={(e) => onFilter({ rarity: e.target.value })}
    />
    <OptionSelect
      minW="max-content"
      color="content.primary"
      placeholder="Type"
      options={TypeOptions}
      onChange={(e) => onFilter({ type: e.target.value })}
    />
  </HStack>
);

interface IPokemonCardList {
  pokemonList: IPokemonCard[];
}

const PokemonCardsList = ({ pokemonList = [] }: IPokemonCardList) => (
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
  const [pokemonList, setPokemon] = useState([] as IPokemonCard[]);

  useEffect(() => {
    (async () => {
      const params: PokemonQueryParameters = { page: 1, pageSize: 20 };
      try {
        const cards = await pokemonService.getAll(params);
        setPokemon(cards);
      } catch (e) {
        console.error(e);
      }
    })();
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
        {/* Main */}
        <Flex w="100%" justifyContent="space-between">
          <Heading color="content.primary">Pokemon market</Heading>
          <HStack>
            <PokemonNameSearch onSearch={(name) => searchFilter({ name })} />
            <Button bg="bg.button">Cart</Button>;
          </HStack>
        </Flex>

        <Divider color="border.divider" />

        {/* filter */}
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <PokemonFilter onFilter={(value) => searchFilter(value)} />
        </Flex>

        {/* Product card list */}
        {data.isLoading ? (
          <Spinner />
        ) : (
          <PokemonCardsList
            pokemonList={
              isNonEmptyArray(data.results) ? data.results : pokemonList
            }
          />
        )}

        {}
      </Stack>
    </Flex>
  );
};

export default Home;
