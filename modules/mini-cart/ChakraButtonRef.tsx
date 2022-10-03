import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import React from "react";
import { usePokemonCartStore } from "../../stores/cart";
import { currencyAdder } from "../../utils/currencyAdder";

type MiniCartTotalCommonTextProps = {
  label: string;
  value: number | string;
};
const MiniCartTotalCommonText = (props: MiniCartTotalCommonTextProps) => (
  <Flex justifyContent="space-between">
    <Text color="content.primary">{props.label}</Text>
    <Text color="content.primary">{props.value}</Text>
  </Flex>
);
export const MiniCartTotal = () => {
  const cartItemById = usePokemonCartStore((state) => state.cartItemById);
  const cartItemIds = usePokemonCartStore((state) => state.cartItemIds);

  const totalQuantity = cartItemIds.reduce(
    (accQuantity, id) => accQuantity + cartItemById[id].quantity,
    0
  );
  const cartTotal = usePokemonCartStore((state) => state.total);
  const currency = usePokemonCartStore((state) => state.currency);
  const addCurrency = currencyAdder(currency);

  const hasNoCartItems = isEmpty(cartItemIds);

  return (
    <Stack width="100%" paddingBottom="48px" spacing="18px">
      <MiniCartTotalCommonText
        label="Total cart amount"
        value={totalQuantity ?? "-"}
      />
      <MiniCartTotalCommonText
        label="Total price"
        value={addCurrency(cartTotal, "-")}
      />
      <Link passHref href="./payment">
        <Button
          bg="button.secondary"
          color="content.primary"
          borderRadius="8px"
          height="48px"
          isDisabled={hasNoCartItems}
        >
          Continue to Payment
        </Button>
      </Link>
    </Stack>
  );
};
