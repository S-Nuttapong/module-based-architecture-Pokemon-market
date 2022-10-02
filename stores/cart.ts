import create from 'zustand'

import { IPokemonCard } from '../@types/pokemonAPIs'
import { ICartServices, IPokemonCart, QuantityChangePayload } from '../services/cart-services/cartServicesFactory'
import { ClientCartServices } from '../services/cart-services/ClientCartServices'

export interface CartState extends IPokemonCart {
    initializeCart: () => Promise<void>
    addToCart: (item: IPokemonCard) => Promise<void>,
    clearAllItems: () => Promise<void>
    updateItemQuantity: (payload: QuantityChangePayload) => Promise<void>
}

export const pokemonCartStoreFactory = (apis: ICartServices) => create<CartState>()((set) => ({
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
    updateItemQuantity: async ({ id, quantity }) => {
        const { total } = await apis.updateItemQuantity({ id, quantity })
        set((state) => {
            state.cartItemById[id].quantity = quantity
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

export const usePokemonCartStore = pokemonCartStoreFactory(ClientCartServices())
