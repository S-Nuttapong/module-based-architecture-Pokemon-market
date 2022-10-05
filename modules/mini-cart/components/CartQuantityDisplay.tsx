import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { miniCartChildFactory } from "../miniCartChildFactory";
import { useItemQuantity } from "../useItemsQuantityCounter";

export const CartQuantityDisplay = miniCartChildFactory(({ id }) => {
  const quantity = useItemQuantity(id);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      bg="button.primary"
      h="54px"
      minW="200px"
      borderRadius="8px"
    >
      <Text color="content.primary">{quantity}</Text>
    </Flex>
  );
});
