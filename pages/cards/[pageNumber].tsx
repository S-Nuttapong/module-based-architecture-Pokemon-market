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
import {
  GetStaticPropsResult,
  InferGetStaticPaths,
} from "../../@types/type-utils/next-helpers";
import { MiniCart } from "../../modules/mini-cart/MiniCart";

import { PokemonFilter } from "../../modules/search-filter/Filter";
import { ISearch, Search } from "../../modules/search-filter/Search";
import {
  SearchStatus,
  useSearchFilter,
} from "../../modules/search-filter/useSearchFilter";
import { usePokemonCartStore } from "../../stores/pokemon-cart";
import { isNonEmptyArray } from "../../utils/common";
import { pokemonCardServices } from "../../services/pokemonCardServices";

import { ProductCardGrid } from "../../modules/product-card/ProductCardGrid";
import { SEOMeta } from "../../components/SEOMeta";
import { LinkBasedPagination } from "../../modules/LinkBasedPagination";
import { HackOutOfStockPoputator } from "../../utils/HackOutOfStockPopulator";

const POKEMON_MARKET_CARDS_META = {
  pageSize: 20,
  totalPages: 125,
  title: `Pokemon Card Market`,
  description:
    "Number one platform for trading Pokemon cards, we offer zero commission-fee, come trade your Pokemon cards, and get rich today !",
};

/**
 * @todo check with business and design team, if we should expose the card inventory / stock at real time,
 * @todo if the real time need, we may need to discuss with BE about the possibility to adopt web socket, then we may re-assess the rendering pattern again, atm, it is ISR (without revalidation) for web-vital and SEO benefit
 */
export async function getStaticPaths() {
  const getPageLists = (firstPagesToRender = 20) => {
    const dummy = null;
    return Array(firstPagesToRender)
      .fill(dummy)
      .map((_, index) => `${index + 1}`);
  };

  const paths = getPageLists().map((pageNumber) => ({
    params: { pageNumber },
  }));

  return { paths, fallback: "blocking" } as const;
}

export const getStaticProps = async ({
  params,
}: InferGetStaticPaths<typeof getStaticPaths>) => {
  const currentPage = Number(params.pageNumber);
  const hackOutOfStockPopulator = new HackOutOfStockPoputator();

  const pokemonList = hackOutOfStockPopulator.populateAndTrackPrice(
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
        hackPriceRecords: hackOutOfStockPopulator.getRecord(),
      },
    },
  };
};

const DesktopSearch = (props: ISearch) => (
  <Search w="fit-content" {...props} display={["none", "none", "flex"]} />
);

const MobileSearch = (props: ISearch) => (
  <Search w="100%" {...props} display={["flex", "flex", "none"]} />
);

export default function PokemonCardsMarketPage(
  props: GetStaticPropsResult<typeof getStaticProps>
) {
  const { pokemonList: pagePokemonList, meta } = props;
  const initializeCart = usePokemonCartStore((state) => state.initializeCart);
  const [data, searchFilter] = useSearchFilter();
  const hackOutOfStockPopulator = new HackOutOfStockPoputator(
    meta.hackPriceRecords
  );

  const searchResult = data.results;

  const searchedPokemonList = useMemo(() => {
    if (searchResult?.status === SearchStatus.Found) {
      return hackOutOfStockPopulator.poplulatePrice(searchResult.data);
    }
    return [];
  }, [searchResult]);

  const pokemonList = isNonEmptyArray(searchedPokemonList)
    ? searchedPokemonList
    : pagePokemonList;

  const ProductCardsGridViewBySearchStatus = {
    [SearchStatus.Cleared]: () => <ProductCardGrid pokemonList={pokemonList} />,
    [SearchStatus.Found]: () => (
      <ProductCardGrid pokemonList={searchedPokemonList} />
    ),
    [SearchStatus.NotFound]: () => (
      <Text color="content.primary" w="100%" textAlign="center" fontSize="18px">
        Oops, we could not find the Pokemons you are looking for...
      </Text>
    ),
  };

  const searchStatus = searchResult?.status ?? SearchStatus.Cleared;

  const ProductCardGridView = ProductCardsGridViewBySearchStatus[searchStatus];

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
            <Flex justifyContent="center" alignItems="center">
              <Spinner
                color="content.primary"
                size={["md", "lg", "xl", "xl"]}
              />
            </Flex>
          ) : (
            <ProductCardGridView />
          )}
        </Stack>

        <Box mb="30px">
          <LinkBasedPagination
            totalPages={meta.totalPages}
            currentPage={meta.currentPage}
            pageSize={meta.pageSize}
          />
        </Box>
      </Flex>
    </>
  );
}
