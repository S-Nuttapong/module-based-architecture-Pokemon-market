import { safeParseJSON } from "../../utils/safeParseJSON"
import { CartItemById, CartItemID, cartServiceFactory, IPokemonCart } from "./cartServicesFactory"


type CartFields = keyof IPokemonCart

/**
 * mock cart services for testing purpose only !
 */
