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

//search: GET https://api.pokemontcg.io/v2/cards

//rarity: getGrowthRateByName

const pokemonService = {
  getAll: async (params?: PokemonTCG.Parameter) => {
    const { data: results } = await axios({
      url: "https://api.pokemontcg.io/v2/cards",
      method: "get",
      params,
    });
    return results.data as PokemonTCG.Card[];
  },
};

const Home = () => {
  // const pokemon = await axios.get(
  //   `https://api.hubapi.com/crm/v3/objects/tickets/${ticketId}`,
  //   {
  //     params: {
  //       hapikey: process.env.HUBSPOT_API_KEY,
  //     },
  //   }
  // );
  const [pokemonList, setPokemon] = useState([] as PokemonTCG.Card[]);

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

  //console.debug({ pokemonList });

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
            <Input w="" placeholder="Search by name" />
            <Button bg="bg.button">Cart</Button>
          </HStack>
        </Flex>

        <Divider color="border.divider" />

        {/* filter */}
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <HStack spacing="16px">
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Set"
            />
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Rarity"
            />
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Type"
            />
          </HStack>
        </Flex>

        {/* Product card list */}
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(150px,1fr) )"
          columnGap="16px"
          rowGap="26px"
        >
          {pokemonList.map((pokemon) => (
            <GridItem key={pokemon.name} color="content.primary">
              <Box h="300px">
                <Flex h="50%" position="relative" justifyContent="center">
                  <Box position="absolute" zIndex={1}>
                    <Image
                      src={pokemon.images.small}
                      width="102px"
                      height="142px"
                      objectFit="contain"
                      alt={pokemon.name}
                    />
                  </Box>
                  <Box
                    h="40px"
                    w="100%"
                    bg="bg.secondary"
                    position="absolute"
                    borderTopLeftRadius="16px"
                    borderTopRightRadius="16px"
                    bottom={0}
                  />
                </Flex>
                <Flex
                  h="50%"
                  bg="bg.secondary"
                  padding="16px"
                  flexDir="column"
                  justifyContent="space-between"
                  borderBottomLeftRadius="16px"
                  borderBottomRightRadius="16px"
                >
                  <Text textAlign="center">{pokemon.name}</Text>
                  <Stack spacing="8px" alignItems="center">
                    <HStack
                      divider={
                        <Box w="4px" h="4px" bg="white" borderRadius="4px" />
                      }
                    >
                      <Text fontSize="12px">$2.29</Text>
                      <Text fontSize="12px">Out of stock</Text>
                    </HStack>
                    <Button bg="bg.overlay">Add to cart</Button>
                  </Stack>
                </Flex>
              </Box>
              {/* <Link href={pokemon.url}>{pokemon.url}</Link> */}
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Flex>
  );
};

export default Home;
