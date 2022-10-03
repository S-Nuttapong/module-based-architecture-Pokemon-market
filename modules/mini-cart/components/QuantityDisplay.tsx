import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { usePokemonCartStore } from "../../../stores/cart";
import { miniCartChildFactory } from "../miniCartChildFactory";

export const QuantityDisplay = miniCartChildFactory(({ id }) => {
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
