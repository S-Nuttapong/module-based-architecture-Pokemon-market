/**
 * @description you can turn a certain fields into required fields
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * @description you have deep nested object, you just want to get away quickly without having to perform type guard inside so many deep fields then you can use this
 * @note this kind of defeats the type safety purpose, so consider this as the last resource, and make sure you know what you are doing
 */
export type DeepRequire<T> = {
  [P in keyof T]: T[P] extends object ? DeepRequire<T[P]> : T[P]
}
