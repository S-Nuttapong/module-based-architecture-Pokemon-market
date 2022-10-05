import create from 'zustand'

import { IPokemonCard } from '../@types/pokemonAPIs'
import { ICartServices, IPokemonCart, QuantityChangePayload } from '../services/cart-services/cartServicesFactory'
import { clientCartServices } from '../services/cart-services/clientCartServices'
import { immer } from 'zustand/middleware/immer'
import { noop } from '../utils/common'
import { devtools } from 'zustand/middleware'
import { WithError } from '../@types/type-utils/error'


type EventResultHandlers = { onFail?: (currentState: WithError<IPokemonCart>) => void, onSuccess?: (currentState: IPokemonCart) => void }

type WithResultHandlers<TPayload = {}> = TPayload & EventResultHandlers

export interface ICartState extends IPokemonCart {
    isLoading: true | false, //note: immer can not infer true/false as boolean, so we have to assign literal type instead
    initializeCart: () => Promise<void>
    addToCart: (item: IPokemonCard) => Promise<void>,
    clearAllItems: (payload?: WithResultHandlers) => Promise<void>
    updateItemQuantity: (payload: WithResultHandlers<QuantityChangePayload>) => Promise<void>
}

export const pokemonCartStoreFactory = (apis: ICartServices) => create<ICartState>()(immer(devtools((set, get) => ({
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
    updateItemQuantity: async ({ id, quantity, onFail = noop }) => {
        try {
            set({ isLoading: true })
            const { total, item } = await apis.updateItemQuantity({ id, quantity })

            console.debug({ total, item })

            set((state) => {
                state.cartItemById[item.id] = item
                state.total = total
                state.isLoading = false
            })
        }
        catch (error) {
            onFail({ ...get(), error })
        }
    },
    clearAllItems: async (payload = {}) => {
        const { onFail = noop, onSuccess = noop } = payload

        try {
            set({ isLoading: true })
            const { status } = await apis.clearAllItems()
            if (status === 'Fail') return
            set((state) => {
                state.cartItemById = {}
                state.cartItemIds = []
                state.isLoading = false
            })
            onSuccess(get())
        }
        catch (error) {
            onFail({ ...get(), error })
        }
    }
}))))

//TODO: port the real BE services once ready
export const usePokemonCartStore = pokemonCartStoreFactory(clientCartServices(typeof window === 'undefined' ? {} as Storage : localStorage))
