import { useEffect, useState } from 'react'

/**
 * 
 * @param value mostly for primitive value, for non-primitive value, it is advisable to maintain it within state, so it only fire this debounce only when state change
 * @param delay amount of time in ms before the debounce state changes
 * @returns delay/debounced value that you can then use
 * @example 
 * const [search, setSearch] = useState('')
 * const searchKeywordWhenUsersStopTyping = useDebounce(search)
 * 
 * useEffect(() => {
 *  //your search action goes here
 * }, [searchKeywordWhenUsersStopTyping])
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}
