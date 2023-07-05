import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { IPokemonCard } from "../../@types/pokemonCard";
import { usePokemonCartStore } from "../../stores/pokemon-cart";

/**
 * @todo: extract add to cart hook, should there be use cases elsewhere
 * @param props
 * @returns
 */
export const AddToCartButton = (props: IPokemonCard) => {
  const [isBeginAddedToCart, setIsBeingAddedToCart] = useState(false);
  const addToCart = usePokemonCartStore((state) => state.addToCart);
  const isLoading = usePokemonCartStore((state) => state.isLoading);

  const handleAddToCart = async () => {
    setIsBeingAddedToCart(true);
    await addToCart(props);
    setIsBeingAddedToCart(false);
  };

  return (
    <Button
      bg="button.primary"
      _hover={{
        bg: "button.hover",
        _disabled: {
          bg: "button.primary",
          opacity: 0.4,
          cursor: "not-allowed",
        },
      }}
      onClick={handleAddToCart}
      isLoading={isLoading && isBeginAddedToCart}
      isDisabled={isLoading || props.isOutOfStock}
      aria-disabled={isLoading || props.isOutOfStock}
    >
      Add to cart
    </Button>
  );
};
