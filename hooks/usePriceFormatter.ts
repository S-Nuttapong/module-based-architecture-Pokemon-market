import isFunction from 'lodash/isFunction'
import { Numeric } from '../@types/common'
import { usePokemonCartStore } from '../stores/cart'
import { currencyAdder } from '../utils/currencyAdder'

const useCurrencyDI = () => usePokemonCartStore(state => state.currency)

type FallbackPriceFormatter = string | ((currency: string) => string)

//TODO: check what languages we'll be supporting and update type, also consider extracting to centralize type files
type SupportLanguage = string

type Configs = {
    useCurrency: typeof useCurrencyDI,
    fallback: FallbackPriceFormatter | string
    currencySymbolsMap: Record<SupportLanguage, string>
}

const DEFAULT_CONFIGS: Configs = {
    useCurrency: useCurrencyDI,
    fallback: '',
    currencySymbolsMap: { 'USD': '$' }
}

export const usePriceFormatter = (configs = {} as Configs) => {
    const { useCurrency, fallback: basedFallback, currencySymbolsMap } = { ...DEFAULT_CONFIGS, ...configs }
    const currency = useCurrency()
    const addCurrency = currencyAdder(currencySymbolsMap[currency] || currency)

    const formatPrice = (price?: Numeric, fallback = basedFallback) => {
        if (price) return addCurrency(price)
        if (isFunction(fallback)) return fallback(currency)
        return fallback
    }

    return formatPrice
}

