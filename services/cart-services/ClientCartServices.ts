import { safeParseJSON } from "../../utils/safeParseJSON"
import { cartServicesFactory, IPokemonCart } from "./cartServicesFactory"
import { nanoid } from 'nanoid'

type CartFields = keyof IPokemonCart

/**
 * Client based cart services leveraged on window storage, until we have proper BE
 * @todo Consider adopting locale forage, and dependency type, should incognito mode be required. Also make sure to add await setter and getter, should locale forage be adopted 
 * @note Although, storage is synchronous, we have to cast async function to adhere to the interface, this will come in handy when changing to async storage like locale forage
 * @caveat This only works on client side, do not use on server side ! 
 */
export const clientCartServices = (storage: Storage) => {
    const getItem = <TField extends CartFields>(key: TField, fallback?: IPokemonCart[TField]) => safeParseJSON<IPokemonCart[TField]>(storage.getItem(key), fallback)
    const setItem = <TField extends CartFields>(key: TField, value: IPokemonCart[TField]) => storage.setItem(key, JSON.stringify(value))
    return cartServicesFactory({
        addToCart: async (item) => {
            const id = nanoid()
            const cartItemById = getItem('cartItemById', {})
            const cartItemIds = getItem('cartItemIds', [])
            const total = getItem('total', 0)

            const itemPrice = item.price ?? 0
            const newCartItem = { id, item, quantity: 1, itemTotal: itemPrice }
            const newTotal = total + itemPrice
            const newCartItemById = { ...cartItemById, [id]: newCartItem }
            const newCartItemIds = [...cartItemIds, id]

            setItem('cartItemById', newCartItemById)
            setItem('cartItemIds', newCartItemIds)
            setItem('total', newTotal)

            return { total: newTotal, item: newCartItem }
        },
        updateItemQuantity: async ({ id, quantity }) => {
            const cartItemById = getItem('cartItemById')
            const total = getItem('total')

            const cartItem = cartItemById[id]
            const quantityChange = quantity - cartItem.quantity
            const itemPrice = cartItem?.item?.price ?? 0
            const newItemTotal = itemPrice * quantityChange
            const newItemTotalChange = newItemTotal - cartItem.itemTotal
            const newTotal = total + newItemTotalChange
            const updatedCartItem = { ...cartItem, quantity, itemTotal: newItemTotal }

            setItem('cartItemById', { ...cartItemById, [id]: updatedCartItem })
            setItem('total', newTotal)

            return { total: newTotal, item: updatedCartItem }
        },
        clearAllItems: async () => {
            storage.clear()
            return { status: 'Success' }
        },
        fetch: async () => {
            return {
                total: getItem('total', 0),
                cartItemById: getItem('cartItemById', {}),
                cartItemIds: getItem('cartItemIds', []),
                currency: 'USD'
            }
        }
    })
}