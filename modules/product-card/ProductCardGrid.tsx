import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { IPokemonCard } from "../../services/pokemon-card-services/pokemonCardServices";
import { ProductCard } from "./ProductCard";

interface IPokemonCardList {
  pokemonList: IPokemonCard[];
}
export const ProductCardGrid = ({ pokemonList = [] }: IPokemonCardList) => (
  <Grid
    gridTemplateColumns="repeat(auto-fill, minmax(150px,1fr) )"
    columnGap="16px"
    rowGap="26px"
  >
    {pokemonList.map((pokemon) => (
      <GridItem key={pokemon.id} color="content.primary">
        <ProductCard {...pokemon} />
      </GridItem>
    ))}
  </Grid>
);
