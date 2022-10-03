import { Grid, GridItem } from "@chakra-ui/react";
import { IPokemonCard } from "../../@types/pokemonAPIs";
import React from "react";
import { ProductCard } from "./ProductCard";

interface IPokemonCardList {
  pokemonList: IPokemonCard[];
}
export const PokemonCardsList = ({ pokemonList = [] }: IPokemonCardList) => (
  <Grid
    gridTemplateColumns="repeat(auto-fill, minmax(150px,1fr) )"
    columnGap="16px"
    rowGap="26px"
  >
    {pokemonList.map((pokemon) => (
      <GridItem key={pokemon.name} color="content.primary">
        <ProductCard {...pokemon} />
      </GridItem>
    ))}
  </Grid>
);
