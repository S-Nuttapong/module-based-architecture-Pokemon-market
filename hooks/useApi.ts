import { useState } from "react"
import { GenericApi } from "../@types/type-utils/asyncFunction"

/**
 * simple hook to provide remote state
 * @params action your api
 * @todo: replace this with React query, should we the need to implement infinite scroll query
 * @return action with loading error, result state automatically tracked
 */
export const useApi = <TAction extends GenericApi, TError = Error>(action: TAction) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<TError | unknown>()
    const [results, setResults] = useState<Awaited<ReturnType<TAction>>>()

    const actionWithRemoteState = async (...args: Parameters<TAction>) => {
        setIsLoading(true)
        try {
            const results = await action(...args)
            setResults(results)
        }
        catch (e) {
            setError(e)
        }
        finally {
            setIsLoading(false)
        }
    }

    const data = { results, error, isLoading }

    return [data, actionWithRemoteState] as const
}