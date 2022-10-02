import { IPokemonCard } from "../../@types/pokemonAPIs"
import { PartialExcept } from "../../@types/type-utils/partial"

export type CartItemID = string

export interface IPokemonCartItem {
    id: CartItemID
    item: IPokemonCard
    quantity: number
    itemTotal: number
}

export type CartItemById = Record<CartItemID, IPokemonCartItem>
export interface IPokemonCart {
    total: number,
    currency: string,
    cartItemIds: CartItemID[]
    cartItemById: CartItemById,
}

export type QuantityChangePayload = { id: CartItemID, quantity: number }

export type CartMutationResults<TFields extends keyof IPokemonCart = "total", TObject = {}> = PartialExcept<IPokemonCart, TFields> & TObject
export interface ICartServices {
    addToCart: (item: IPokemonCard) => Promise<CartMutationResults<"total", { item: IPokemonCartItem }>>
    updateItemQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults<"total", { item: IPokemonCartItem }>>
    clearAllItems: () => Promise<{ status: 'Success' | 'Fail' }>
    fetch: () => Promise<IPokemonCart>
}

/**
 * identity function to help guide creating the service properly
 */
export const cartServicesFactory = (apiResolvers: ICartServices) => apiResolvers