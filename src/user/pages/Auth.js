import React, { useState, useContext } from 'react'
import { AuthContext } from '../../shared/components/context/auth-context'

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'

import { useForm } from '../../shared/hooks/form'
import { useHttpClient } from '../../shared/hooks/http'

import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import './Auth.css'

export default function Auth(props) {
  const auth = useContext(AuthContext)
  const [isSignupMode, setIsNewUser] = useState(true)

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

  const { http, clearErrorHandler, isLoading, error } = useHttpClient()

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

    if (isSignupMode) {
      try {
        const signupData = await http(
          'POST',
          'http://localhost:5001/api/users/signup',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        )

        console.log({ signupData })
        auth.login()
      } catch (err) {}
    } else {
      try {
        const { email, password } = formState.inputs

        const loginData = await http(
          'POST',
          'http://localhost:5001/api/users/login',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify({
            email: email.value,
            password: password.value,
          })
        )

        console.log({ loginData })
        auth.login()
      } catch (excepshun) {}
    }
  }


  return (
    <>
      {error && <ErrorModal error={error} onClear={clearErrorHandler} />}
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
