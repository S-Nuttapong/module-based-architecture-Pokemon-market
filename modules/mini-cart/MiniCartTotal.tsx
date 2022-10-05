import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import React from "react";
import { usePriceFormatter } from "../../hooks/usePriceFormatter";
import { usePokemonCartStore } from "../../stores/pokemon-cart";

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
  const hasNoCartItems = isEmpty(cartItemIds);
  const formatPrice = usePriceFormatter();

  return (
    <Stack width="100%" paddingBottom="48px" spacing="18px">
      <MiniCartTotalCommonText
        label="Total cart amount"
        value={totalQuantity ?? "-"}
      />
      <MiniCartTotalCommonText
        label="Total price"
        value={formatPrice(cartTotal, "-")}
      />
      <Link passHref href="./payment">
        <Button
          bg="button.secondary"
          color="content.primary"
          _hover={{
            boxShadow: "0px 8px 24px rgba(234, 124, 105, 0.32)",
          }}
          _active={{
            boxShadow: "0px 8px 24px rgba(234, 124, 105, 0.32)",
          }}
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
