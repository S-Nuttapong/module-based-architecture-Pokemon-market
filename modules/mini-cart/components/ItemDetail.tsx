import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { usePriceFormatter } from "../../../hooks/usePriceFormatter";
import { usePokemonCartStore } from "../../../stores/pokemon-cart";
import { currencyAdder } from "../../../utils/currencyAdder";
import { miniCartChildFactory } from "../miniCartChildFactory";

export const ItemDetail = miniCartChildFactory(({ id }) => {
  const price = usePokemonCartStore(
    (state) => state.cartItemById[id].item.price
  );
  const name = usePokemonCartStore((state) => state.cartItemById[id].item.name);
  const formatPrice = usePriceFormatter();
  return (
    <Box>
      <Text color="content.primary" minWidth="ma">
        {name}
      </Text>
      <Text color="content.secondary">{formatPrice(price)}</Text>
    </Box>
  );
});
