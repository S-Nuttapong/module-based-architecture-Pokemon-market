import create from 'zustand'

import { IPokemonCard } from '../@types/pokemonAPIs'
import { PartialExcept } from '../@types/type-utils/partial'

type CartItemID = string

type QuantityChangePayload = { id: CartItemID, quantity: number }

interface IPokemonCartItem extends IPokemonCard {
    quantity: number
}

interface IPokemonCart {
    total: number,
    currency: string,
    cartItemIds: CartItemID[]
    cartItemById: Record<CartItemID, IPokemonCartItem>,
}

interface CartState {
    total: number,
    currency: string,
    cartItemIds: CartItemID[]
    cartItemById: Record<CartItemID, IPokemonCartItem>,
    initializeCart: () => Promise<void>
    addToCart: (item: IPokemonCard) => Promise<void>,
    clearAllItems: () => Promise<void>
    increaseQuantity: (payload: QuantityChangePayload) => Promise<void>
    decreaseQuantity: (payload: QuantityChangePayload) => Promise<void>
}

type CartMutationResults<K extends keyof IPokemonCart = "total"> = PartialExcept<IPokemonCart, K>

type PokemonCartStoreAPIs = {
    addToCart: (item: IPokemonCard) => Promise<CartMutationResults>
    increaseQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults>
    decreaseQuantity: (payload: QuantityChangePayload) => Promise<CartMutationResults>
    clearAllItems: () => Promise<{ status: 'Success' | 'Fail' }>
    fetch: () => Promise<IPokemonCart>
}

export const pokemonCartStoreFactory = (apis: PokemonCartStoreAPIs) => create<CartState>()((set) => ({
    total: 0,
    currency: 'USD',
    cartItemIds: [],
    cartItemById: {},
    initializeCart: async () => {
        const cart = await apis.fetch()
        set(() => cart)
    },
    addToCart: async (item) => {
        const { total } = await apis.addToCart(item)
        set((state) => {
            state.cartItemById[item.id] = { ...item, quantity: 1 }
            state.cartItemIds.push(item.id)
            state.total = total
            return state
        })
    },
    increaseQuantity: async ({ id, quantity }) => {
        const { total } = await apis.increaseQuantity({ id, quantity })
        set((state) => {
            state.cartItemById[id].quantity += quantity
            state.total = total
            return state
        })
    },
    decreaseQuantity: async ({ id, quantity }) => {
        const { total } = await apis.decreaseQuantity({ id, quantity })
        set((state) => {
            state.cartItemById[id].quantity -= quantity
            state.total = total
            return state
        })
    },
    clearAllItems: async () => {
        const { status } = await apis.clearAllItems()
        if (status === 'Fail') return
        set((state) => {
            state.cartItemById = {}
            state.cartItemIds = []
            return state
        })
    }
}))

export const usePokemonCartStore = pokemonCartStoreFactory()
