import { IPokemonCard } from "./pokemonAPIs"
import { PartialExcept } from "./type-utils/partial"

export type CartItemID = string

export interface IPokemonCart {
    total: number,
    currency: string,
    cartItemIds: CartItemID[]
    cartItemById: Record<CartItemID, IPokemonCartItem>,
}

export type QuantityChangePayload = { id: CartItemID, quantity: number }

export interface IPokemonCartItem extends IPokemonCard {
    quantity: number
}

export type CartMutationResults<K extends keyof IPokemonCart = "total"> = PartialExcept<IPokemonCart, K>

export type PokemonCartStoreAPIs = {
    addToCart: (item: IPokemonCard) => Promise<CartMutationResults>
    increaseQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults>
    decreaseQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults>
    clearAllItems: () => Promise<{ status: 'Success' | 'Fail' }>
    fetch: () => Promise<IPokemonCart>
}
