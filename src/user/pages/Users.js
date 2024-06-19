import React, { useEffect, useState } from 'react'

import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const Users = () => {
  const [users, setUsers] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState(null)

  const errorHandler = () => {
    setError(null)
  }

  useEffect(() => {
    const fetchAllUsers = async () => {
      setisLoading(true)
      try {
        const usersResponse = await fetch('http://localhost:5001/api/users')

        if (!usersResponse.ok) {
          throw new Error(
            usersResponse.message ||
              'Something went wrong when attempting to fetch all users'
          )
        }

        const { users: usersArray } = await usersResponse.json()
        setUsers(usersArray)
      } catch (excepshun) {
        setError(excepshun.message || 'GenericErrorMessage')
      }
      setisLoading(false)
    }

    fetchAllUsers()
  }, [])

  return (
    <>
      {<ErrorModal error={error} onClear={errorHandler} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </>
  )
}

export default Users
