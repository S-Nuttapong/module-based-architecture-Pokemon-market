import { IPokemonCard } from "../../@types/pokemonAPIs"
import { PartialExcept } from "../../@types/type-utils/partial"

export type CartItemID = string

export type CartItemById = Record<CartItemID, IPokemonCartItem>

export interface IPokemonCart {
    total: number,
    currency: string,
    cartItemIds: CartItemID[]
    cartItemById: CartItemById,
}

export type QuantityChangePayload = { id: CartItemID, quantity: number }

export interface IPokemonCartItem extends IPokemonCard {
    quantity: number
}

export type CartMutationResults<K extends keyof IPokemonCart = "total"> = PartialExcept<IPokemonCart, K>

export interface ICartServices {
    addToCart: (item: IPokemonCard) => Promise<CartMutationResults>
    updateItemQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults>
    clearAllItems: () => Promise<{ status: 'Success' | 'Fail' }>
    fetch: () => Promise<IPokemonCart>
}

/**
 * identity function to help guide creating the service properly
 */
export const cartServicesFactory = (apiResolvers: ICartServices) => apiResolvers