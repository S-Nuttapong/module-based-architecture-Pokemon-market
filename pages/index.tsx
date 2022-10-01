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
  SelectProps,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  InputChangeHandler,
  IPokemonCard,
  PokemonQueryParameters,
} from "../types";
import { PokemonCard } from "../modules/PokemonCard";
import { useDebounce } from "../hooks/useDebounce";
import { useAsync } from "../hooks/useAsync";
import merge from "lodash/merge";

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

type OnNameSearch = (value: string) => void;
interface IPokemonSearch extends Omit<InputProps, "onChange" | "value"> {
  onSearch?: OnNameSearch;
  searchDelay?: number;
}

const noop = <T extends any>(_: T) => {};

const PokemonNameSearch = (props: IPokemonSearch) => {
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
      color="content.primary"
      placeholder="Search by name"
      value={searchTerm}
      onChange={handleChange}
      {...rest}
    />
  );
};

type OptionValue = string | ReadonlyArray<string> | number | undefined;

type Option<T extends OptionValue> = { value: T; label: string; id?: string };
interface IOptionSelect<T extends OptionValue> extends SelectProps {
  options: Option<T>[];
}

function OptionSelect<T extends OptionValue>(props: IOptionSelect<T>) {
  const { options, ...selectProps } = props;
  return (
    <Select {...selectProps}>
      {options.map(({ label, value, id }, index) => (
        //note: should be save to use index here, as we render static options list
        <option key={id || index} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}

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

const isTruthy = (value: any) => !!value;

const isFalsy = (value: any) => !value;

//name search do wild card
//types search do nothing
//rarity do exact match
const useSearchFilter = () => {
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

    console.debug({ query, areAllSearchTermsCleared, newTerms });

    if (areAllSearchTermsCleared) return [];

    return await PokemonTCG.findCardsByQueries({ pageSize: 20, q: query });
  };

  return useAsync(searchFilterHandler);
};

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

function isNonEmptyArray<T>(array?: T[] | T): array is T[] {
  return Array.isArray(array) && !!array.length;
}

export default Home;
