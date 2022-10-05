import isFunction from 'lodash/isFunction'
import compose from 'lodash/fp/compose'
import { usePokemonCartStore } from '../stores/cart'
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

