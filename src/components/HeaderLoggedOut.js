import React, { useState, useContext } from 'react'
import Axios from 'axios'

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const HeaderLoggedOut = () => {
	const [username, setUsername] = useState()
	const [password, setPassword] = useState()
	const appDispatch = useContext(DispatchContext)
	const { headers } = useContext(StateContext)

	const handleSubmit = async (e) => {
		e.preventDefault()

		let user = new FormData();

		user.append("app_name", "contact_application_csc")
		user.append('username', username)
		user.append('password', password)

		try {
			const response = await Axios.post("/users/login", user, { headers })
			appDispatch({ type: "login", data: response.data })
		} catch(err) {
			appDispatch({type: "flashMessage", value: "Incorrect username and password; try again!"})
		}
	}

	return (
		<div>
			<form onSubmit = { handleSubmit } className="mb-0 pt-2 pt-md-0">
          		<div className="row align-items-center">
            		<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              			<input onChange = { e => setUsername(e.target.value) } name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
            		</div>
            		<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              			<input onChange = { e => setPassword(e.target.value) } name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            		</div>
            		<div className="col-md-auto">
              			<button className="btn btn-success btn-sm">Sign In</button>
            		</div>
          		</div>
        	</form>
		</div>
	)
}

export default HeaderLoggedOut