import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useEffect, useMemo } from "react";
import { InferGetStaticPaths } from "../../@types/type-utils/next-helpers";
import { Pagination } from "../../components/Pagination";
import { MiniCart } from "../../modules/mini-cart/MiniCart";

import { PokemonFilter } from "../../modules/search-filter/Filter";
import { ISearch, Search } from "../../modules/search-filter/Search";
import { useSearchFilter } from "../../modules/search-filter/useSearchFilter";
import { usePokemonCartStore } from "../../stores/cart";
import { isNonEmptyArray } from "../../utils/common";
import { pokemonCardServices } from "../../services/pokemon-card-services/pokemonCardServices";
import { HackPricePoputator } from "../../utils/HackPricePopulator";
import { ProductCardGrid } from "../../modules/product-card/ProductCardGrid";
import { SEOMeta } from "../../components/SEOMeta";

const POKEMON_MARKET_CARDS_META = {
  pageSize: 20,
  totalPages: 125,
  title: `Pokemon Card Market`,
  description:
    "Number one platform for trading Pokemon cards, we offer zero commission-fee, come trade your Pokemon cards, and get rich today !",
};

export const getStaticProps = async ({
  params,
}: InferGetStaticPaths<typeof getStaticPaths>) => {
  const currentPage = Number(params.pageNumber.split("-")[1]);
  const hackPricePopulator = new HackPricePoputator();

  const pokemonList = hackPricePopulator.populateAndTrackPrice(
    await pokemonCardServices.getAll({
      page: currentPage || 1,
      pageSize: POKEMON_MARKET_CARDS_META.pageSize,
    })
  );

  return {
    props: {
      pokemonList,
      meta: {
        currentPage,
        ...POKEMON_MARKET_CARDS_META,
        hackPriceRecords: hackPricePopulator.getRecord(),
      },
    },
  };
};

export async function getStaticPaths() {
  const getPageLists = (firstPagesToRender = 20) => {
    const dummy = null;
    return Array(firstPagesToRender)
      .fill(dummy)
      .map((_, index) => `${index + 1}`);
  };

  const paths = getPageLists().map((pageNumber) => ({
    params: { pageNumber: `deck-${pageNumber}` },
  }));

  return { paths, fallback: "blocking" } as const;
}

const DesktopSearch = (props: ISearch) => (
  <Search w="fit-content" {...props} display={["none", "none", "flex"]} />
);

const MobileSearch = (props: ISearch) => (
  <Search w="100%" {...props} display={["flex", "flex", "none"]} />
);

export default function Home(
  props: Awaited<ReturnType<typeof getStaticProps>>["props"]
) {
  const { pokemonList: pagePokemonList, meta } = props;
  const initializeCart = usePokemonCartStore((state) => state.initializeCart);
  const [data, searchFilter] = useSearchFilter();
  const hackPricePopulator = new HackPricePoputator(meta.hackPriceRecords);

  const searchedPokemonList = useMemo(() => {
    if (!data.results) return;
    return hackPricePopulator.poplulatePrice(data.results);
  }, [data.results]);

  const pokemonList = isNonEmptyArray(searchedPokemonList)
    ? searchedPokemonList
    : pagePokemonList;

  useEffect(() => {
    initializeCart();
  }, []);

  return (
    <>
      <SEOMeta title={meta.title} description={meta.description} />
      <Flex
        bg="bg.primary"
        minH="100vh"
        w="100vw"
        justifyContent="space-between"
        flexDir="column"
        px={[0, "30px", "60px", "120px"]}
      >
        <Stack
          w="full"
          h="full"
          padding={["20px", "20px", "30px", "30px"]}
          spacing="24px"
        >
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
            <ProductCardGrid pokemonList={pokemonList} />
          )}
        </Stack>

        <Box mb="30px">
          <Pagination
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            pageSize={meta.pageSize}
          />
        </Box>
      </Flex>
    </>
  );
}
