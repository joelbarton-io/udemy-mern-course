import { useState, useCallback, useRef, useEffect } from 'react'
export const useHttpClient = () => {
  const activeHttpRequests = useRef([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const http = useCallback(
    async (url, options = { method: 'GET', headers: {}, body: null }) => {
      setIsLoading(true)
      const controller = new AbortController()
      activeHttpRequests.current.push(controller)

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        const data = await response.json()

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtlr) => reqCtlr !== controller
        )

        if (!response.ok) {
          throw new Error(data.message)
        }

        setIsLoading(false)
        return data
      } catch (excepshun) {
        setError(excepshun.message || 'Something went wrong, please try again')
        setIsLoading(false)
        throw excepshun
      }
    },
    []
  )

  const clearErrorHandler = () => setError(null)

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((ctlr) => ctlr.abort())
    }
  }, [])
  return { isLoading, error, http, clearErrorHandler }
}
