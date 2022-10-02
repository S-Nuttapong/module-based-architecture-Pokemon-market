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
  TableCellProps,
  TableHeadProps,
  TableHeadProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { IPokemonCard, PokemonQueryParameters } from "../@types/pokemonAPIs";
import { PokemonCard } from "../modules/PokemonCard";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { OptionSelect } from "../components/OptionSelect";
import { PokemonNameSearch } from "../modules/PokemonNameSearch";
import { isNonEmptyArray } from "../utils/common";
import React from "react";
import { DataTable } from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { usePokemonCartStore } from "../stores/cart";
import Image from "next/image";
import isEmpty from "lodash/isEmpty";

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

const currencyAdder = (currency: string) => (price?: number | string) =>
  price ? `${currency} ${price}` : `Free`;

type ColumnComponent = (props: { id: string }) => JSX.Element;

const columnComponentFactory = (fnComponent: ColumnComponent) => fnComponent;

const DecreaseQuantityButton = columnComponentFactory(({ id }) => {
  const updateItemQuantity = usePokemonCartStore(
    (state) => state.updateItemQuantity
  );
  return (
    <Button
      bg="button.primary"
      w="54px"
      h="54px"
      borderRadius="8px"
      onClick={() => {
        console.debug({ id });
      }}
    >
      -
    </Button>
  );
});

const CartItemImage = columnComponentFactory(({ id }) => {
  const imgSrc = usePokemonCartStore(
    (state) => state.cartItemById[id].item.images.small
  );
  const name = usePokemonCartStore((state) => state.cartItemById[id].item.name);
  return (
    <Flex alignItems="flex-start">
      <Image
        src={imgSrc}
        width="44px"
        height="60px"
        objectFit="contain"
        alt={name}
        blurDataURL={imgSrc}
        placeholder="blur"
      />
    </Flex>
  );
});

const ItemColumn = columnComponentFactory(({ id }) => {
  return (
    <Stack flexDir="column" alignContent="flex-start">
      <CartItemImage id={id} />
      <DecreaseQuantityButton id={id} />
    </Stack>
  );
});

const QuantityDisplay = columnComponentFactory(({ id }) => {
  const quantity = usePokemonCartStore(
    (state) => state.cartItemById[id].quantity
  );
  return (
    <Box
      textAlign="center"
      bg="button.primary"
      h="54px"
      minW="200px"
      borderRadius="8px"
    >
      <Text color="content.primary">{quantity}</Text>
    </Box>
  );
});

const ItemDetail = columnComponentFactory(({ id }) => {
  const currency = usePokemonCartStore((state) => state.currency);
  const price = usePokemonCartStore(
    (state) => state.cartItemById[id].item.price
  );
  const name = usePokemonCartStore((state) => state.cartItemById[id].item.name);
  const addCurrency = currencyAdder(currency);
  return (
    <Box>
      <Text color="content.primary" minWidth="ma">
        {name}
      </Text>
      <Text color="content.secondary">{addCurrency(price)}</Text>
    </Box>
  );
});

const QuantityColumn = columnComponentFactory(({ id }) => (
  <Stack>
    <ItemDetail id={id} />
    <QuantityDisplay id={id} />
  </Stack>
));

const IncreaseQuantityButton = columnComponentFactory(({ id }) => {
  const updateItemQuantity = usePokemonCartStore(
    (state) => state.updateItemQuantity
  );
  return (
    <Button
      bg="button.primary"
      w="54px"
      h="54px"
      borderRadius="8px"
      onClick={() => {
        console.debug({ id });
      }}
    >
      +
    </Button>
  );
});

const TotalItemPrice = columnComponentFactory(({ id }) => {
  const currency = usePokemonCartStore((state) => state.currency);
  const itemTotal = usePokemonCartStore(
    (state) => state.cartItemById[id].itemTotal
  );
  const addCurrency = currencyAdder(currency);

  return <Text color="content.primary">{addCurrency(itemTotal)}</Text>;
});

const PriceColumn = columnComponentFactory(({ id }) => (
  <Flex flexDir="column" justifyContent="space-between">
    <TotalItemPrice id={id} />
    <IncreaseQuantityButton id={id} />
  </Flex>
));

const MiniCartLineItems = () => {
  const cartIds = usePokemonCartStore((state) => state.cartItemIds);
  const cartItemIds = cartIds.map((id) => ({ id }));
  const columnHelper = createColumnHelper<typeof cartItemIds[number]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Item",
        cell: (id) => <ItemColumn id={id.getValue()} />,
      }),
      columnHelper.accessor("id", {
        header: "Oty",
        cell: (id) => <QuantityColumn id={id.getValue()} />,
      }),
      columnHelper.accessor("id", {
        header: "Price",
        cell: (id) => <PriceColumn id={id.getValue()} />,
        meta: {
          cell: {
            p: "0px",
            display: "flex",
            alignItems: "",
          } as TableCellProps,
          header: {
            p: "0px",
            textAlign: "end",
          } as TableHeadProps,
        },
      }),
    ],
    [cartIds]
  );

  if (isEmpty(cartIds))
    return <Text color="content.primary">Your Cart is Empty</Text>;

  return <DataTable columns={columns} data={cartItemIds} />;
};

function PokemonCart() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>() as ChakraButtonRef;

  return (
    <>
      <Button
        bg="button.secondary"
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      >
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
              <Button onClick={onClose} bg="button.secondary">
                Close
              </Button>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
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
      </Stack>
    </Flex>
  );
};

export default Home;
