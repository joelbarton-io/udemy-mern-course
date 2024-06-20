import React, { useState, useContext } from 'react'
import { AuthContext } from '../../shared/context/auth-context'

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
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
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
      const tempFormData = {
        ...formState.inputs,
        image: undefined,
        name: undefined,
        // image: {
        //   value: null,
        //   isValid: false,
        // },
        // name: {
        //   value: '',
        //   isValid: false,
        // },
      }
      setFormData(
        tempFormData,
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
      console.log({ formValidity: formState })
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          //   image: {
          //     value: null,
          //     isValid: false,
          //   },
        },
        false
      )
    }

    setIsNewUser((prev) => !prev)
  }

  const authSubmitHandler = async (e) => {
    e.preventDefault()
    const { email, password, name, image } = formState.inputs

    if (isSignupMode) {
      const signupOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
      }

      try {
        const fd = new FormData()
        fd.append('name', name.value)
        fd.append('email', email.value)
        fd.append('password', password.value)
        fd.append('image', image.value)

        const { user, message } = await http(
          'http://localhost:5001/api/users/signup',
          { method: 'POST', body: fd }
        )
        auth.login(user.id)
      } catch (excepshun) {
        console.error(excepshun.message)
      }
    } else {
      const loginOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      }
      try {
        const { user, message } = await http(
          'http://localhost:5001/api/users/login',
          loginOptions
        )
        auth.login(user.id)
      } catch (excepshun) {
        console.error(excepshun.message)
      }
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
          {isSignupMode && (
            <ImageUpload id="image" onInput={inputHandler} center />
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
          />
          <Button type="submit">
            {/* disabled={!formState.isValid} */}
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
