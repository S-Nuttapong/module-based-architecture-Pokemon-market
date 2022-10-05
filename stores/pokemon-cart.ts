import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { noop } from '../utils/common'
import { devtools } from 'zustand/middleware'
import { WithError } from '../@types/type-utils/error'
import { IPokemonCard } from "../@types/pokemonCard"
import { storageBasedCartServices } from '../services/pokemon-cart/storageBasedPokemonCartServices'
import { IPokemonCartServices, QuantityChangePayload } from '../@types/pokemonCart'
import { IPokemonCart } from "../services/pokemon-cart/CartItemID"


type EventResultHandlers = { onFail?: (currentState: WithError<IPokemonCart>) => void, onSuccess?: (currentState: IPokemonCart) => void }

type WithResultHandlers<TPayload = {}> = TPayload & EventResultHandlers

export interface ICartState extends IPokemonCart {
    isLoading: true | false, //note: immer can not infer true/false as boolean, so we have to assign literal type instead
    initializeCart: () => Promise<void>
    addToCart: (item: IPokemonCard) => Promise<void>,
    clearAllItems: (payload?: WithResultHandlers) => Promise<void>
    updateItemQuantity: (payload: WithResultHandlers<QuantityChangePayload>) => Promise<void>
}

/**
 * factory function for creating cart store hook
 * @param services cart service this, serve purpose for testing, and porting different services, as long as it adhere to ICartServices 
 * @returns hook function that contain state and actions of cart
 */
export const pokemonCartStoreFactory = (services: IPokemonCartServices) => create<ICartState>()(immer(devtools((set, get) => ({
    total: 0,
    isLoading: false,
    currency: 'USD',
    cartItemIds: [],
    cartItemById: {},
    initializeCart: async () => {
        set({ isLoading: true })
        const cart = await services.fetch()
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
        const { total, item } = await services.addToCart(payload)
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
            const { total, item } = await services.updateItemQuantity({ id, quantity })

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
            const { status } = await services.clearAllItems()
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

/**
 * @note: undefined window implies the ssr, also it can't be extracted as variable here, to make it work we must inline like so 
 * @todo: port the real BE services once ready
 */
export const usePokemonCartStore = pokemonCartStoreFactory(storageBasedCartServices(typeof window === 'undefined' ? {} as Storage : localStorage))
