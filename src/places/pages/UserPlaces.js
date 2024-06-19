import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http'

import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

import PlaceList from '../components/PlaceList'

const UserPlaces = () => {
  const { http, isLoading, error, clearErrorHandler } = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState(null)
  const userId = useParams().userId

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const { places } = await http(
          `http://localhost:5001/api/places/user/${userId}`
        )
        setLoadedPlaces(places)
      } catch (excepshun) {
        console.log({ excepshun })
      }
    }
    fetchUserPlaces()
  }, [userId])

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      {isLoading ?? (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </>
  )
}

export default UserPlaces
