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

import './Auth.css'

export default function Auth(props) {
  const auth = useContext(AuthContext)
  const [isNewUser, setIsNewUser] = useState(true)

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

  const toggle = () => {
    if (isNewUser) {
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

    if (isNewUser) {
      try {
        console.log({ fsi: formState.inputs })
        const res = await fetch('http://localhost:5001/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        })

        const data = await res.json()
        console.log({ data })
      } catch (err) {
        console.log(err)
      }
    }
    auth.login()
  }

  return (
    <Card className="authentication">
      <h2>{isNewUser ? 'Signup Required' : 'Login Required'}</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {isNewUser && (
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
          {isNewUser ? 'Signup' : 'Login'}
        </Button>
        <Button inverse type="button" onClick={toggle}>
          {isNewUser ? 'Existing User?' : 'New User?'}
        </Button>
      </form>
    </Card>
  )
}
