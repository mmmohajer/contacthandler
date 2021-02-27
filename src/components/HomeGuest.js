import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { useImmerReducer } from 'use-immer'
import { CSSTransition } from 'react-transition-group'

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

import Page from './Page'

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext)
  const { headers } = useContext(StateContext)

	const initialState = {
		name: {
			value: "",
			hasErrors: false,
			message: ""
		},
		username: {
			value: "",
			hasErrors: false,
			message: "",
			isUnique: false,
			checkCount: 0
		},
		email: {
			value: "",
			hasErrors: false,
			message: "",
			isUnique: false,
			checkCount: 0
		},
		password: {
      value: "",
      hasErrors: false,
      message: ""
    },
		submitCount: 0
	}
	const registerReducer = (draft, action) => {
		switch (action.type) {
			case "nameImmediately":
				draft.name.hasErrors = false
				draft.name.value = action.value
				if (draft.name.value.length > 30) {
          draft.name.hasErrors = true
					draft.name.message = "Name cannot exceed 30 characters."
				}
        if (draft.name.value && !/^([a-zA-Z ]+)$/.test(draft.name.value)) {
          draft.name.hasErrors = true
          draft.name.message = "Name can only contain letters."
        }
				return
			case "nameAfterDelay":
        if (draft.name.value.length < 2) {
          draft.name.hasErrors = true
          draft.name.message = "Name must be at least 2 characters."
        }
				return
			case "usernameImmediately":
				draft.username.hasErrors = false
				draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Name cannot exceed 30 characters."
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers."
        }
				return
			case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
				return
			case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "This username is already taken."
        } else {
          draft.username.isUnique = true
        }
				return	
			case "emailImmediately":
				draft.email.hasErrors = false
				draft.email.value = action.value
				return
			case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
				return
			case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "This email is already taken."
        } else {
          draft.email.isUnique = true
        }
			case "passwordImmediately":
				draft.password.hasErrors = false
				draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 50 characters."
        }
				return
			case "passwordAfterDelay":
        if (draft.password.value && draft.password.value.length < 6) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 6 characters."
        }
        if (!draft.password.value) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 6 characters." 
        }
				return
			case "submitForm":
        if (!draft.name.hasErrors && !draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        }
        return
		}
	}

	const [state, dispatch] = useImmerReducer(registerReducer, initialState)

  useEffect(() => {
    if (state.name.value) {
      const delay = setTimeout(() => dispatch({type: "nameAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.name.value])

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({type: "usernameAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    isUsernameUnique()
  }, [state.username.checkCount])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({type: "emailAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    isEmailUnique()
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({type: "passwordAfterDelay"}), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.submitCount) {
      userSubmit()
    }
  }, [state.submitCount])

  const isUsernameUnique = async () => {
    const response = await Axios.get("/users/read-all", { headers })
    let users = response.data.data
    let usernames = []
    users.map(user => {
      return usernames.push(user.username)
    })
    dispatch({type: "usernameUniqueResults", value: usernames.includes(state.username.value)})
  }

  const isEmailUnique = async () => {
    const response = await Axios.get("/users/read-all", { headers })
    let users = response.data.data
    let emails = []
    users.map(user => {
      return emails.push(user.email)
    })
    dispatch({type: "emailUniqueResults", value: emails.includes(state.email.value)})
  }

  const userSubmit = async () => {
    let newUser = new FormData();

    newUser.append('name', state.name.value)
    newUser.append('username', state.username.value)
    newUser.append('email', state.email.value)
    newUser.append('password', state.password.value)

    try {
      const response = await Axios.post("/users/create",  newUser, { headers })
      appDispatch({type: "flashMessage", value: "Congrats! You can now login with your credentials."})
    } catch (err) {
      console.log(err)
    }

  }

	const handleSubmit = (e) => {
		e.preventDefault()
    dispatch({type: "nameImmediately", value: state.name.value})
    dispatch({type: "nameAfterDelay", value: state.name.value})
    dispatch({type: "usernameImmediately", value: state.username.value})
    dispatch({type: "usernameAfterDelay", value: state.username.value, noRequest: true})
    dispatch({type: "emailImmediately", value: state.email.value})
    dispatch({type: "emailAfterDelay", value: state.email.value, noRequest: true})
    dispatch({type: "passwordImmediately", value: state.password.value})
    dispatch({type: "passwordAfterDelay", value: state.password.value})
    dispatch({type: "submitForm"})
    window.scrollTo(0, 0)
	}

	return (
		<Page wide = { true } title = "Welcome!">
      		<div className="row align-items-center">
        		<div className="col-lg-7 py-3 py-md-5">
          			<h1 className="display-3 smallerText">Would you like to have you added in my public contact list?</h1>
          			<p className="lead text-muted">
                  In order to add your information into my public contact list, first you need 
                  to sign up via the registration form. Then, using the top bar login form, login to your account 
                  to see my contact list and to add your information.
                </p>
        		</div>
	        	<div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
	          		<form onSubmit = { handleSubmit }>
	          			<div className="form-group">
	              			<label htmlFor="name-register" className="text-muted mb-1">
	                			<small>Name</small>
	              			</label>
	              			<input onChange = { e => dispatch({type: "nameImmediately", value: e.target.value}) } id="name-register" name="name" className="form-control" type="text" placeholder="Full Name" autoComplete="off" />
	            			  <CSSTransition in={state.name.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                				<div className="alert alert-danger small liveValidateMessage">{state.name.message}</div>
              				</CSSTransition>
	            		</div>
	            		<div className="form-group">
	              			<label htmlFor="username-register" className="text-muted mb-1">
	                			<small>Username</small>
	              			</label>
	              			<input onChange = { e => dispatch({type: "usernameImmediately", value: e.target.value}) } id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
                      <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
                      </CSSTransition>
	            		</div>
	            		<div className="form-group">
	              			<label htmlFor="email-register" className="text-muted mb-1">
	                			<small>Email</small>
	              			</label>
	              			<input onChange = { e => dispatch({type: "emailImmediately", value: e.target.value}) } id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                      <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
                      </CSSTransition>
	            		</div>
	            		<div className="form-group">
	              			<label htmlFor="password-register" className="text-muted mb-1">
	                			<small>Password</small>
	              			</label>
	              			<input onChange = { e => dispatch({type: "passwordImmediately", value: e.target.value}) } id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
                      <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                        <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
                      </CSSTransition>
	            		</div>
	            		<button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
	              			Sign up
	            		</button>
	          		</form>
	        	</div>
      		</div>
    	</Page>
	)
}

export default HomeGuest