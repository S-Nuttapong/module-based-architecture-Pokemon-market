import { IPokemonCard } from "./pokemonCard"

export type CartItemID = string;

export interface IPokemonCartItem {
    id: CartItemID;
    item: IPokemonCard;
    quantity: number;
    itemTotal: number;
}

export type CartItemById = Record<CartItemID, IPokemonCartItem>;

export interface IPokemonCart {
    total: number;
    currency: string;
    cartItemIds: CartItemID[];
    cartItemById: CartItemById;
}