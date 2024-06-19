import { useState, useCallback, useRef, useEffect } from 'react'
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeHttpRequests = useRef([])

  const http = useCallback(
    async (method = 'GET', url, headers = {}, body = null) => {
      setIsLoading(true)
      const httpAbortController = new AbortController()
      activeHttpRequests.current.push(httpAbortController)

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortController,
        })

        if (!response.ok) {
          throw new Error(response.message)
        }
        return await response.json()
      } catch (excepshun) {
        setError(excepshun.message || 'Something went wrong, please try again')
      }
      setIsLoading(false)
    },
    []
  )

  const clearErrorHandler = () => setError(null)
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((controller) => controller.abortCtrl())
    }
  })
  return { isLoading, error, http, clearErrorHandler }
}
