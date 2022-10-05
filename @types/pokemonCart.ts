import { PartialExcept } from "./type-utils/partial"
import { IPokemonCard } from "./pokemonCard"
import { CartItemID, IPokemonCart, IPokemonCartItem } from "../services/pokemon-cart/CartItemID"

export type QuantityChangePayload = { id: CartItemID, quantity: number }

export type CartMutationResults<TFields extends keyof IPokemonCart = "total", TObject = {}> = PartialExcept<IPokemonCart, TFields> & TObject

export interface IPokemonCartServices {
    addToCart: (item: IPokemonCard) => Promise<CartMutationResults<"total", { item: IPokemonCartItem }>>
    updateItemQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults<"total", { item: IPokemonCartItem }>>
    clearAllItems: () => Promise<{ status: 'Success' | 'Fail' }>
    fetch: () => Promise<IPokemonCart>
}
