import {
  Flex,
  Stack,
  TableCellProps,
  TableHeadProps,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import isEmpty from "lodash/isEmpty";
import { IncreaseQuantityButton } from "./components/IncreaseCartQuantityButton";
import { TotalItemPrice } from "./components/TotalCartItemPrice";

import { CartItemImage } from "./components/CartItemImage";
import { DecreaseQuantityButton } from "./components/DecreaseCartQuantityButton";
import { DataTable } from "../../components/DataTable";
import { usePokemonCartStore } from "../../stores/pokemon-cart";
import { miniCartChildFactory } from "./miniCartChildFactory";
import { CartItemDetail } from "./components/CartItemDetail";
import { CartQuantityDisplay } from "./components/CartQuantityDisplay";

const ItemColumn = miniCartChildFactory(({ id }) => {
  return (
    <Stack flexDir="column" alignContent="flex-start">
      <CartItemImage id={id} />
      <DecreaseQuantityButton id={id} />
    </Stack>
  );
});
const QuantityColumn = miniCartChildFactory(({ id }) => (
  <Flex height="100%" flexDir="column" justifyContent="space-between">
    <CartItemDetail id={id} />
    <CartQuantityDisplay id={id} />
  </Flex>
));
const PriceColumn = miniCartChildFactory(({ id }) => (
  <Flex
    height="100%"
    width="100%"
    flexDir="column"
    justifyContent="space-between"
    alignItems="flex-end"
  >
    <TotalItemPrice id={id} />
    <IncreaseQuantityButton id={id} />
  </Flex>
));

export const MiniCartLineItems = () => {
  const cartIds = usePokemonCartStore((state) => state.cartItemIds);
  const cartItemIds = cartIds.map((id) => ({ id }));
  const columnHelper = createColumnHelper<typeof cartItemIds[number]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Item",
        cell: (id) => <ItemColumn id={id.getValue()} />,
      }),
      columnHelper.accessor("id", {
        header: "Oty",
        cell: (id) => <QuantityColumn id={id.getValue()} />,
      }),
      columnHelper.accessor("id", {
        header: "Price",
        cell: (id) => <PriceColumn id={id.getValue()} />,
        meta: {
          cell: {
            p: "0px",
          } as TableCellProps,
          header: {
            p: "0px",
            textAlign: "end",
          } as TableHeadProps,
        },
      }),
    ],
    [cartIds]
  );

  if (isEmpty(cartIds))
    return <Text color="content.primary">Your Cart is Empty</Text>;

  return <DataTable columns={columns} data={cartItemIds} />;
};
