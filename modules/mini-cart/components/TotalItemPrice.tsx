import { Text } from "@chakra-ui/react";
import React from "react";
import { usePriceFormatter } from "../../../hooks/usePriceFormatter";
import { usePokemonCartStore } from "../../../stores/pokemon-cart";
import { miniCartChildFactory } from "../miniCartChildFactory";

export const TotalItemPrice = miniCartChildFactory(({ id }) => {
  const formatPrice = usePriceFormatter();
  const itemTotal = usePokemonCartStore(
    (state) => state.cartItemById[id].itemTotal
  );

  return <Text color="content.primary">{formatPrice(itemTotal)}</Text>;
});
