import { Flex, Text, Stack, HStack, Box } from "@chakra-ui/react";
import Image from "next/image";
import { IPokemonCard } from "../../@types/pokemonAPIs";
import { AddToCartButton } from "./AddToCartButton";

export const ProductCard = (props: IPokemonCard) => {
  return (
    <Box h="300px">
      <Flex h="50%" position="relative" justifyContent="center">
        <Box position="absolute" zIndex={1}>
          <Image
            src={props.images.small}
            width="102px"
            height="142px"
            objectFit="contain"
            alt={props.name}
            blurDataURL={props.images.small}
            placeholder="blur"
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
        <Text textAlign="center">{props.name}</Text>
        <Stack spacing="8px" alignItems="center">
          <HStack
            divider={
              <Box
                w="4px"
                h="4px"
                bg="button.disabled"
                borderRadius="4px"
                //Hack: making HStack css class respect the override style
                borderLeftWidth="0px !important"
              />
            }
            minW="max-content"
          >
            <Text fontSize="12px">$2.29</Text>
            <Text fontSize="12px">Out of stock</Text>
          </HStack>
          <AddToCartButton {...props} />
        </Stack>
      </Flex>
    </Box>
  );
};
