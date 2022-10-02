import { RequiredBy } from './require'

/**
 * @description you can turn a certain fields into optional fields with this
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * @description you have deep nested object, you just want to get away quickly without having to perform type guard inside so many deep fields then you can use this
 * @note this kind of defeats the type safety purpose, so consider this as the last resource, and make sure you know what you are doing
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type PartialExcept<T, K extends keyof T> = RequiredBy<Partial<T>, K>
