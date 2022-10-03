import isUndefined from 'lodash/isUndefined'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { CartItemID } from "../../services/cart-services/cartServicesFactory"
import { usePokemonCartStore } from '../../stores/cart'

type QuantityEventHandler = (payload: { id: string, quantity: number }) => void

interface ItemQuantityCounterState {
    decrease: QuantityEventHandler
    increase: QuantityEventHandler
    syncActualQuantity: QuantityEventHandler
    clearAll: () => void
    quantityByItem: Record<CartItemID, number>
}

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