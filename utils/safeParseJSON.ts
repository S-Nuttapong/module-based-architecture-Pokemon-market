import { Nullable } from "../@types/type-utils/nullable"

export const safeParseJSON = <T = unknown>(data?: Nullable<string>, fallback = {} as T): T => {
    if (!data) return fallback

    // If the data is stored as a JSONB, it is directly usable as an object.
    if (typeof data === 'object') return data as T

    try {
        return JSON.parse(data) as T
    } catch (err) {
        return {} as T
    }
}
