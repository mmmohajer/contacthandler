import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const HeaderLoggedIn = () => {
	const appDispatch = useContext(DispatchContext)
	const { user } = useContext(StateContext)

	const handleLogout = () => {
		appDispatch({ type: "logout" })
	}

	return (
		<div className="flex-row my-3 my-md-0">
        	<Link className="btn btn-sm btn-success mr-2" to="/create-contact">
        		Create Contact
        	</Link>
        	<button onClick = { handleLogout } className="btn btn-sm btn-secondary">
        		Sign Out
        	</button>
      	</div>
	)
}

export default HeaderLoggedIn