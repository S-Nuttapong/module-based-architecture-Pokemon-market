import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePokemonCartStore } from "../../../stores/cart";
import { miniCartChildFactory } from "../miniCartChildFactory";
import {
  useItemQuantity,
  useItemQuantityCounter,
} from "../useItemsQuantityCounter";

export const DecreaseQuantityButton = miniCartChildFactory(({ id }) => {
  const quantity = useItemQuantity(id);
  const [isClick, setIsClick] = useState(false);
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
    if (!isClick) return;
    updateItemQuantity({
      id,
      quantity: debouncedQuantity,
      onFail: (state) => {
        syncActualQuantity({ id, quantity: state.cartItemById[id].quantity });
      },
      onSuccess: () => {
        setIsClick(false);
      },
    });
  }, [debouncedQuantity]);

  const isOneLeft = quantity === 1;

  return (
    <Button
      bg="button.primary"
      _hover={{
        bg: "button.hover",
      }}
      w="54px"
      h="54px"
      borderRadius="8px"
      onClick={() => {
        setIsClick(true);
        decrease({ id, quantity });
      }}
      isDisabled={isOneLeft || isLoading}
    >
      -
    </Button>
  );
});
