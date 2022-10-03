import { Button } from "@chakra-ui/react";
import React from "react";
import { usePokemonCartStore } from "../../../stores/cart";
import { miniCartChildFactory } from "../miniCartChildFactory";

export const IncreaseQuantityButton = miniCartChildFactory(({ id }) => {
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
