import { Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePokemonCartStore } from "../../../stores/cart";
import { isFalsy } from "../../../utils/common";
import { miniCartChildFactory } from "../miniCartChildFactory";
import {
  useItemQuantity,
  useItemQuantityCounter,
} from "../useItemsQuantityCounter";

export const DecreaseQuantityButton = miniCartChildFactory(({ id }) => {
  const quantity = useItemQuantity(id);
  const decrease = useItemQuantityCounter((state) => state.decrease);
  const syncActualQuantity = useItemQuantityCounter(
    (state) => state.syncActualQuantity
  );
  const isLoading = usePokemonCartStore((state) => state.isLoading);
  const updateItemQuantity = usePokemonCartStore(
    (state) => state.updateItemQuantity
  );

  const debouncedQuantity = useDebounce(quantity);

  useEffect(() => {
    updateItemQuantity({
      id,
      quantity,
      onFail: (state) => {
        syncActualQuantity({ id, quantity: state.cartItemById[id].quantity });
      },
    });
  }, [debouncedQuantity]);

  return (
    <Button
      bg="button.primary"
      w="54px"
      h="54px"
      borderRadius="8px"
      onClick={() => decrease({ id, quantity })}
      isDisabled={isFalsy(quantity) || isLoading}
    >
      -
    </Button>
  );
});
