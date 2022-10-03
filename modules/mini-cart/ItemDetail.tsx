import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { usePokemonCartStore } from "../../stores/cart";
import { currencyAdder } from "../../utils/currencyAdder";
import { miniCartChildFactory } from "./miniCartChildFactory";

export const ItemDetail = miniCartChildFactory(({ id }) => {
  const currency = usePokemonCartStore((state) => state.currency);
  const price = usePokemonCartStore(
    (state) => state.cartItemById[id].item.price
  );
  const name = usePokemonCartStore((state) => state.cartItemById[id].item.name);
  const addCurrency = currencyAdder(currency);
  return (
    <Box>
      <Text color="content.primary" minWidth="ma">
        {name}
      </Text>
      <Text color="content.secondary">{addCurrency(price)}</Text>
    </Box>
  );
});
