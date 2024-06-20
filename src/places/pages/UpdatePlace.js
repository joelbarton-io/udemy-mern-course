import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

import { useForm } from '../../shared/hooks/form'
import { useHttpClient } from '../../shared/hooks/http'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css'

export default function UpdatePlace() {
  const auth = useContext(AuthContext)
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
    },
    true
  )

  const { isLoading, error, http, clearErrorHandler } = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState(null)

  const placeId = useParams().placeId
  const history = useHistory()

  useEffect(() => {
    const getPlaceToUpdate = async () => {
      try {
        const { place } = await http(
          `http://localhost:5001/api/places/${placeId}`
        )

        setLoadedPlace(place)
        setFormData(
          {
            title: {
              value: place.title,
              isValid: true,
            },
            description: {
              value: place.description,
              isValid: true,
            },
          },
          true
        )
      } catch (excepshun) {}
    }

    getPlaceToUpdate()
  }, [placeId])

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const { place } = await http(
        `http://localhost:5001/api/places/${placeId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
          }),
        }
      )
      history.push(`/${auth.userId}/places`)
    } catch (excepshun) {}
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="input"
            type="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  )
}
