import create from 'zustand'

import { IPokemonCard } from '../@types/pokemonAPIs'
import { ICartServices, IPokemonCart, QuantityChangePayload } from '../services/cart-services/cartServicesFactory'
import { ClientCartServices } from '../services/cart-services/ClientCartServices'
import { immer } from 'zustand/middleware/immer'
export interface CartState extends IPokemonCart {
    isLoading: true | false, //note: immer can not infer true/false as boolean, so we have to assign literal type instead
    initializeCart: () => Promise<void>
    addToCart: (item: IPokemonCard) => Promise<void>,
    clearAllItems: () => Promise<void>
    updateItemQuantity: (payload: QuantityChangePayload) => Promise<void>
}

export const pokemonCartStoreFactory = (apis: ICartServices) => create<CartState>()(immer((set) => ({
    total: 0,
    isLoading: false,
    currency: 'USD',
    cartItemIds: [],
    cartItemById: {},
    initializeCart: async () => {
        set({ isLoading: true })
        const cart = await apis.fetch()
        set((state) => {
            const { cartItemById, cartItemIds, total, currency } = cart
            state.cartItemById = cartItemById
            state.cartItemIds = cartItemIds
            state.total = total
            state.currency = currency
            state.isLoading = false
        })
    },
    addToCart: async (payload) => {
        set({ isLoading: true })
        const { total, item } = await apis.addToCart(payload)
        set((state) => {
            state.cartItemById[item.id] = item
            state.cartItemIds.push(item.id)
            state.total = total
            state.isLoading = false
        })
    },
    updateItemQuantity: async ({ id, quantity }) => {
        set({ isLoading: true })
        const { total, item } = await apis.updateItemQuantity({ id, quantity })
        set((state) => {
            state.cartItemById[item.id] = item
            state.total = total
            state.isLoading = false
        })
    },
    clearAllItems: async () => {
        set({ isLoading: true })
        const { status } = await apis.clearAllItems()
        if (status === 'Fail') return
        set((state) => {
            state.cartItemById = {}
            state.cartItemIds = []
            state.isLoading = false
        })
    }
})))

//TODO: port the real BE services once ready
export const usePokemonCartStore = pokemonCartStoreFactory(ClientCartServices(typeof window === 'undefined' ? {} as Storage : localStorage))
