import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePokemonCartStore } from "../../../stores/pokemon-cart";
import { miniCartChildFactory } from "../miniCartChildFactory";
import {
  useItemQuantity,
  useItemQuantityCounter,
} from "../useItemsQuantityCounter";

/**
 * @todo extract share logic into hook, and reuse in decrease button, and increase button
 */
export const IncreaseQuantityButton = miniCartChildFactory(({ id }) => {
  const quantity = useItemQuantity(id);

  //note: isClick help prevent race condition between increase/decrease button, when the side effect is executed, only the action associated to the clicked button should be fired
  const [isClick, setIsClick] = useState(false);
  const increase = useItemQuantityCounter((state) => state.increase);
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
        increase({ id, quantity });
      }}
      isDisabled={isLoading}
    >
      +
    </Button>
  );
});
