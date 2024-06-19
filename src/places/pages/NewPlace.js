import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

import { useForm } from '../../shared/hooks/form'
import { useHttpClient } from '../../shared/hooks/http'
import { AuthContext } from '../../shared/context/auth-context'

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import './PlaceForm.css'

const NewPlace = () => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        valuke: '',
        isValid: false,
      },
    },
    false
  )

  const auth = useContext(AuthContext)
  const { isLoading, error, http, clearErrorHandler } = useHttpClient()

  const history = useHistory()

  const placeSubmitHandler = async (e) => {
    e.preventDefault()

    const { title, description, address } = formState.inputs

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        address: address.value,
        creator: auth.userId,
      }),
    }

    try {
      await http('http://localhost:5001/api/places', options)
      history.push('/')
    } catch (excepshun) {
      console.log({ excepshun })
    }
  }

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  )
}

export default NewPlace
