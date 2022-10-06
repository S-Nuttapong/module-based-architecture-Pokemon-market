import isFunction from 'lodash/isFunction'
import compose from 'lodash/fp/compose'
import { usePokemonCartStore } from '../stores/pokemon-cart'
import { currencyAdder } from '../utils/currencyAdder'
import { numberFormatter } from '../utils/numberFormatter'

const useCurrencyDI = () => usePokemonCartStore(state => state.currency)

type FallbackPriceFormatter = string | ((currency: string) => string)

//TODO: check what languages we'll be supporting and update type, also consider extracting to centralize type files
type SupportLanguage = string

type Configs = {
    useCurrency: typeof useCurrencyDI,
    fallback: FallbackPriceFormatter | string
    currencySymbolsMap: Record<SupportLanguage, string>
    fixedPoints: number,
}

const DEFAULT_CONFIGS: Configs = {
    useCurrency: useCurrencyDI,
    fallback: '',
    currencySymbolsMap: { 'USD': '$' },
    fixedPoints: 2
}

/**
 * @param configs.fixedPoints will add a fix point to the format price, e.g. 7.99999 => 7.99
 * @param configs.fallback this will be used when there is no price including price being zero 
 * @param configs.useCurrency this will be your currency source, by default it use currency source from cart store, it also act as dependency injection for the unit testing
 * @returns 
 */
export const usePriceFormatter = (configs = {} as Partial<Configs>) => {
    const { useCurrency, fallback: basedFallback, currencySymbolsMap, fixedPoints } = { ...DEFAULT_CONFIGS, ...configs }
    const currency = useCurrency()
    const addCurrency = currencyAdder(currencySymbolsMap[currency] || currency)

    const addFixedPoint = numberFormatter.addFixedPoint(fixedPoints)
    const formatValidPrice = compose(addCurrency, addFixedPoint)

    const formatPrice = (price: number, fallback = basedFallback) => {
        if (price) return formatValidPrice(price)
        if (isFunction(fallback)) return fallback(currency)
        return fallback
    }

    return formatPrice
}

