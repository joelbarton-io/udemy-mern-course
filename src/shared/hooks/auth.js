import { useState, useEffect, useCallback } from 'react'
let logoutTimerID

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null)
  const [loggedinUserid, setLoggedinUserid] = useState(null)

  const login = useCallback((userid, token, existingExpiration) => {
    const freshExpiration = new Date(new Date().getTime() + 1000 * 180)

    setLoggedinUserid(userid)
    setToken(token)
    setTokenExpirationDate(freshExpiration)

    localStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        userid,
        expiration: existingExpiration || freshExpiration.toISOString(),
      })
    )
  }, [])

  const logout = useCallback(() => {
    console.log('logging out and flushing local storage...')
    setLoggedinUserid(null)
    setToken(null)
    setTokenExpirationDate(null)
    localStorage.clear()
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const timeout = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimerID = setTimeout(logout, timeout)
    } else clearTimeout(logoutTimerID)
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const tokenIsActive =
      userData?.expiration && new Date(userData.expiration) > new Date()

    if (tokenIsActive) {
      login(userData.userid, userData.token, new Date(userData.expiration))
      console.log('retrieved userid and token from local storage...')
    }
  }, [])

  return { token, login, logout, loggedinUserid }
}
