import { Flex } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import { miniCartChildFactory } from "./miniCartChildFactory";
import { usePokemonCartStore } from "../../stores/cart";

export const CartItemImage = miniCartChildFactory(({ id }) => {
  const imgSrc = usePokemonCartStore(
    (state) => state.cartItemById[id].item.images.small
  );
  const name = usePokemonCartStore((state) => state.cartItemById[id].item.name);
  return (
    <Flex alignItems="flex-start">
      <Image
        src={imgSrc}
        width="44px"
        height="60px"
        objectFit="contain"
        alt={name}
        blurDataURL={imgSrc}
        placeholder="blur"
      />
    </Flex>
  );
});
