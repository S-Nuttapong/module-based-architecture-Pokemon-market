import { useState } from "react"

type AsyncAction = (...args: any[]) => Promise<any>

/**
 * @todo: replace this with React query, should API support
 */
export const useAsync = <TAction extends AsyncAction, TError = Error>(action: TAction) => {
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