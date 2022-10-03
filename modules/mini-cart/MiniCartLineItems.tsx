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
import { IncreaseQuantityButton } from "./IncreaseQuantityButton";
import { TotalItemPrice } from "./TotalItemPrice";
import { ItemDetail } from "./ItemDetail";
import { QuantityDisplay } from "./QuantityDisplay";
import { CartItemImage } from "./CartItemImage";
import { DecreaseQuantityButton } from "./DecreaseQuantityButton";
import { DataTable } from "../../components/DataTable";
import { usePokemonCartStore } from "../../stores/cart";
import { miniCartChildFactory } from "./miniCartChildFactory";

const ItemColumn = miniCartChildFactory(({ id }) => {
  return (
    <Stack flexDir="column" alignContent="flex-start">
      <CartItemImage id={id} />
      <DecreaseQuantityButton id={id} />
    </Stack>
  );
});
const QuantityColumn = miniCartChildFactory(({ id }) => (
  <Stack>
    <ItemDetail id={id} />
    <QuantityDisplay id={id} />
  </Stack>
));
const PriceColumn = miniCartChildFactory(({ id }) => (
  <Flex flexDir="column" justifyContent="space-between">
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
            display: "flex",
            alignItems: "",
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
