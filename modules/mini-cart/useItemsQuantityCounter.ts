import isUndefined from 'lodash/isUndefined'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { usePokemonCartStore } from '../../stores/pokemon-cart'
import { CartItemID } from '../../@types/pokemonCart'


type QuantityEventHandler = (payload: { id: string, quantity: number }) => void

interface ItemQuantityCounterState {
    decrease: QuantityEventHandler
    increase: QuantityEventHandler
    syncActualQuantity: QuantityEventHandler
    clearAll: () => void
    quantityByItem: Record<CartItemID, number>
}

/**
 * intermediate state for quantity decrement/increment, this will account for the mini cart item table,
 * this will mitigate the input re-rendering entire mini-cart because of the way the design work which is separating all piece of number input apart, instead of grouping them together
 */
export const useItemQuantityCounter = create<ItemQuantityCounterState>()(immer(devtools(((set) => ({
    quantityByItem: {},
    decrease: ({ id, quantity: initialQuantity }) => set((state) => {
        const quantity = state.quantityByItem[id] || initialQuantity
        state.quantityByItem[id] = quantity - 1
    }),
    increase: ({ id, quantity: initialQuantity }) => set((state) => {
        const quantity = state.quantityByItem[id] || initialQuantity
        state.quantityByItem[id] = quantity + 1
    }),
    syncActualQuantity: ({ id, quantity }) => set((state) => {
        state.quantityByItem[id] = quantity
    })
    ,
    clearAll: () => set((state) => {
        state.quantityByItem = {}
    })
})))))

export const useItemQuantity = (id: CartItemID) => {
    const initialQuantity = usePokemonCartStore(state => state.cartItemById[id].quantity)
    const quantity = useItemQuantityCounter(state => state.quantityByItem[id])
    return !isUndefined(quantity) ? quantity : initialQuantity
}