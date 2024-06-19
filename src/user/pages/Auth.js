import React, { useState, useContext } from 'react'
import { AuthContext } from '../../shared/components/context/auth-context'

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form'
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'

import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import './Auth.css'

export default function Auth(props) {
  const auth = useContext(AuthContext)
  const [isSignupMode, setIsNewUser] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const toggleSignupLogin = () => {
    if (isSignupMode) {
      const tempFormData = { ...formState.inputs }
      delete tempFormData.name
      setFormData(
        tempFormData,
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      )
    }

    setIsNewUser((prev) => !prev)
  }

  const authSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (isSignupMode) {
      try {
        const signupResponse = await fetch(
          'http://localhost:5001/api/users/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formState.inputs.name.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          }
        )

        const data = await signupResponse.json()

        if (!data.ok) {
          throw new Error(data.message)
        }
        console.log({ data })
        setIsLoading(false)
        auth.login()
      } catch (err) {
        console.log(err)
        setIsLoading(false)
        setError(err.message || 'Something went wrong, please try again')
      }
    } else {
      try {
        const { email, password } = formState.inputs

        const response = await fetch('http://localhost:5001/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        })

        const data = await response.json()

        if (!data.ok) {
          throw new Error(
            data.message ||
              'generic error, no "message" property on response.data object'
          )
        }
        auth.login()
      } catch (excepshun) {
        setError(
          excepshun.message ||
            'Something went wrong with login, please try again'
        )
        setIsLoading(false)
      }
    }
  }

  const errorHandler = () => {
    setError(null)
  }
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isSignupMode ? 'Signup Required' : 'Login Required'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {isSignupMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password (at least 5 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isSignupMode ? 'Signup' : 'Login'}
          </Button>
          <Button inverse type="button" onClick={toggleSignupLogin}>
            {isSignupMode ? 'Existing User?' : 'New User?'}
          </Button>
        </form>
      </Card>
    </>
  )
}
