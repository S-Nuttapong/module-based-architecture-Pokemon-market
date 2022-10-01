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
  Input,
  InputProps,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import {
  InputChangeHandler,
  IPokemonCard,
  PokemonQueryParameters,
} from "../types";
import { PokemonCard } from "../modules/PokemonCard";
import { useDebounce } from "../hooks/useDebounce";
import { useAsync } from "../hooks/useAsync";

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

type OnChangeSearch = (value: string) => void;
interface IPokemonSearch extends Omit<InputProps, "onChange" | "value"> {
  onSearch?: OnChangeSearch;
  searchDelay?: number;
}

const noop = <T extends any>(_: T) => {};

const PokemonSearch = (props: IPokemonSearch) => {
  const { onSearch = noop, searchDelay, ...rest } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, searchDelay);

  const handleChange: InputChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Input
      w="173px"
      placeholder="Search by name"
      value={searchTerm}
      onChange={handleChange}
      {...rest}
    />
  );
};

const PokemonFilter = () => (
  <HStack spacing="16px">
    <Select minW="max-content" color="content.primary" placeholder="Set" />
    <Select minW="max-content" color="content.primary" placeholder="Rarity" />
    <Select minW="max-content" color="content.primary" placeholder="Type" />
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

const useWildCardSearch = () => {
  const wildCardSearchService = async (value: string) =>
    await PokemonTCG.findCardsByQueries({
      pageSize: 20,
      q: `name:${value}*`,
    });
  return useAsync(wildCardSearchService);
};

const Home = () => {
  const [pokemonList, setPokemon] = useState([] as IPokemonCard[]);

  const [filterTerm, setFilterTerm] = useState({
    set: "",
    rarity: "",
    type: "",
  });

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

  const [data, search] = useWildCardSearch();

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
            <PokemonSearch onSearch={search} />
            <Button bg="bg.button">Cart</Button>;
          </HStack>
        </Flex>

        <Divider color="border.divider" />

        {/* filter */}
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <PokemonFilter />
        </Flex>

        {/* Product card list */}
        {data.isLoading ? (
          <Spinner />
        ) : (
          <PokemonCardsList
            pokemonList={
              Array.isArray(data.results) ? data.results : pokemonList
            }
          />
        )}
      </Stack>
    </Flex>
  );
};

export default Home;
