import React, { useState, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import UpdatePlace from './places/pages/UpdatePlace'
import UserPlaces from './places/pages/UserPlaces'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import Auth from './user/pages/Auth'
import { AuthContext } from './shared/components/context/auth-context'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = useCallback(() => {
    console.log('logging in')
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    console.log('logging out')
    setIsLoggedIn(false)
  }, [])

  let routes

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/:userId/places">
          <UserPlaces />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
