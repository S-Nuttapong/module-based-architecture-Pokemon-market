import { Flex, Text, Stack, HStack, Button, Box } from "@chakra-ui/react";
import Image from "next/image";
import { IPokemonCard } from "../types";

export const PokemonCard = (props: IPokemonCard) => {
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
            divider={<Box w="4px" h="4px" bg="white" borderRadius="4px" />}
          >
            <Text fontSize="12px">$2.29</Text>
            <Text fontSize="12px">Out of stock</Text>
          </HStack>
          <Button bg="bg.overlay">Add to cart</Button>
        </Stack>
      </Flex>
    </Box>
  );
};
