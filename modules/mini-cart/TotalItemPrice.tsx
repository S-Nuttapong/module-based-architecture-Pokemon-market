import { Text } from "@chakra-ui/react";
import React from "react";
import { usePokemonCartStore } from "../../stores/cart";
import { currencyAdder } from "../../utils/currencyAdder";
import { miniCartChildFactory } from "./miniCartChildFactory";

export const TotalItemPrice = miniCartChildFactory(({ id }) => {
  const currency = usePokemonCartStore((state) => state.currency);
  const itemTotal = usePokemonCartStore(
    (state) => state.cartItemById[id].itemTotal
  );
  const addCurrency = currencyAdder(currency);

  return <Text color="content.primary">{addCurrency(itemTotal)}</Text>;
});
