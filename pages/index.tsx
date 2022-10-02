import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Select,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { IPokemonCard, PokemonQueryParameters } from "../@types/pokemonAPIs";
import { PokemonCard } from "../modules/PokemonCard";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { OptionSelect } from "../components/OptionSelect";
import { PokemonNameSearch } from "../modules/PokemonNameSearch";
import { isNonEmptyArray } from "../utils/common";
import React from "react";
import { DataTable } from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";

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

type ChakraButtonRef = React.MutableRefObject<HTMLButtonElement | null>;

type UnitConversion = {
  fromUnit: string;
  toUnit: string;
  factor: number;
};

const useMiniCartLinItems = () => {};

const MiniCartLineItems = () => {
  const columnHelper = createColumnHelper<UnitConversion>();

  const data: UnitConversion[] = [
    {
      fromUnit: "inches",
      toUnit: "millimetres (mm)",
      factor: 25.4,
    },
    {
      fromUnit: "feet",
      toUnit: "centimetres (cm)",
      factor: 30.48,
    },
    {
      fromUnit: "yards",
      toUnit: "metres (m)",
      factor: 0.91444,
    },
  ];

  const columns = [
    columnHelper.accessor("fromUnit", {
      cell: (info) => info.getValue(),
      header: "To convert",
    }),
    columnHelper.accessor("toUnit", {
      cell: (info) => info.getValue(),
      header: "Into",
    }),
    columnHelper.accessor("factor", {
      cell: (info) => <Box>{info.getValue()}</Box>,
      header: "Multiply by",
      meta: {
        isNumeric: true,
      },
    }),
  ];

  return <DataTable columns={columns} data={data} />;
};

function PokemonCart() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>() as ChakraButtonRef;

  return (
    <>
      <Button bg="bg.button" ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Cart
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay bg="bg.overlay" />
        <DrawerContent bg="bg.secondary">
          <DrawerCloseButton />
          <DrawerHeader color="content.primary">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="26px" fontWeight="600" color="content.primary">
                  Cart
                </Text>
                <Text
                  fontSize="12px"
                  fontWeight="400"
                  color="content.secondary"
                  _hover={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  clear all
                </Text>
              </Box>
              {/* TODO: replace with close icon instead */}
              <Button onClick={onClose} bg="bg.button">
                Close
              </Button>
            </Flex>
          </DrawerHeader>

          <DrawerBody p="0px">
            <MiniCartLineItems />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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
    <Select
      minW="max-content"
      color="content.primary"
      placeholder="Set"
      borderRadius="8px"
      borderWidth="1px"
      borderColor="border.primary"
    />
    <OptionSelect
      minW="max-content"
      color="content.primary"
      placeholder="Rarity"
      borderRadius="8px"
      borderWidth="1px"
      borderColor="border.primary"
      options={RarityOptions}
      onChange={(e) => onFilter({ rarity: e.target.value })}
    />
    <OptionSelect
      minW="max-content"
      color="content.primary"
      placeholder="Type"
      borderRadius="8px"
      borderWidth="1px"
      borderColor="border.primary"
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
            <PokemonCart />
          </HStack>
        </Flex>

        <Divider borderColor="border.primary" />

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
