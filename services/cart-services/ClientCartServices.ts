import { safeParseJSON } from "../../utils/safeParseJSON"
import { cartServicesFactory, IPokemonCart } from "./cartServicesFactory"


type CartFields = keyof IPokemonCart

/**
 * Client based cart services leverage on storage, until we have proper BE
 * @todo Consider adopting locale forage, and dependency type, should incognito mode be required. Also make sure to add await setter and getter, should locale forage be adopted 
 * @note Although, storage is synchronous, we have to cast async function to adhere to the interface, this will come in handy when changing to async storage like locale forage
 * @caveat This only works on client side, do not use on server side ! 
 */
export const ClientCartServices = (storage = localStorage) => {
    const getItem = <TField extends CartFields>(key: TField, fallback?: IPokemonCart[TField]) => safeParseJSON<IPokemonCart[TField]>(storage.getItem(key), fallback)
    const setItem = <TField extends CartFields>(key: TField, value: IPokemonCart[TField]) => storage.setItem(key, JSON.stringify(value))
    return cartServicesFactory({
        addToCart: async (item) => {
            const cartItemById = getItem('cartItemById', {})
            const cartItemIds = getItem('cartItemIds', [])
            const total = getItem('total', 0)

            const newTotal = total + (item?.price ?? 0)
            const newCartItemById = { ...cartItemById, [item.id]: { ...item, quantity: 1 } }
            const newCartItemIds = [...cartItemIds, item.id]

            setItem('cartItemById', newCartItemById)
            setItem('cartItemIds', newCartItemIds)
            setItem('total', newTotal)

            return { total: newTotal }
        },
        updateItemQuantity: async ({ id, quantity }) => {
            const cartItemById = getItem('cartItemById')
            const total = getItem('total')

            const cartItem = cartItemById[id]
            const quantityChange = quantity - cartItem.quantity
            const itemPrice = cartItemById[id]?.price ?? 0
            const newTotal = (itemPrice * quantityChange) + total

            setItem('cartItemById', { ...cartItemById, [id]: { ...cartItem, quantity } })
            setItem('total', newTotal)

            return { total: newTotal }
        },
        clearAllItems: async () => {
            setItem('cartItemById', {})
            setItem('cartItemIds', [])
            setItem('total', 0)
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