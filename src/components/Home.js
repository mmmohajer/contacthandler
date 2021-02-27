import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

import Page from './Page'

const Home = () => {
	const [contacts, setContacts] = useState([])
	const [currentId, setCurrentId] = useState()
	const [isDeleted, setIsDeleted] = useState(0)
	const appDispatch = useContext(DispatchContext)

	const { user, headers } = useContext(StateContext)

	useEffect(() => {
		contactsFinder()
		getCurrentName()
	}, [])

	const contactsFinder = async () => {
		const response = await Axios.get("/contacts/read-all", { headers })
		let allContacts = response.data.data
		allContacts.map((contact) => {
			if (!parseInt(contact.is_deleted)) {
				setContacts((prev) => prev.concat(contact))
			}
		})
	}

	const getCurrentName = async () => {
		const response = await Axios.get("/users/read-all", { headers })
    	let users = response.data.data
    	let curUser = users.filter(newUser => {
      	return (newUser.access_token == user.access_token)
    	})
    	setCurrentId(curUser[0].id)
	}

	const deleteHandler = async (contactId) => {
		let result = window.confirm("Are you sure to delete?")
		try {
			const response = await Axios.post(`/contacts/delete/${contactId}`, [] ,{ headers })
			appDispatch({type: "flashMessage", value: "Your contact information has been successfully deleted!"})
			setContacts((prev) => prev.filter(contact => contact.id !== contactId))
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Page title = "Public List">
			<h2 className = "text-center">Hi there! 
			<br/> 
			Welcome to my public contact list page
			.</h2>
	      	<p className = "lead">
	      	Below, you can see the list of all contacts. Please add your information to 
	      	the contact list by clicking on <strong>Create Contact</strong> button.
	      	Afterwards, you can <strong>update/delete</strong> your contact information.
	      	<br />
	      	You can also <strong>view</strong> any of other contact 
	      	informations. Notice that by clicking on the <strong>view icon</strong> you 
	      	can see/print more detailed information about one contact. 
	      	</p>

	      	<ul className = "contact-list">
	      		{contacts.map((contact, idx) => {
	      			return (
	      				<li className = "contact-individual" key = {idx}>
	      					<span>{contact.first_name} {contact.last_name}</span>
	      						{ currentId !== contact.assigned_to ? (
	      							<span>
	      								<Link to={ `/mycontacts/${contact.id}` } className="contact-icon">
	      									<button className = "viewButton">View</button>
			        						
			        					</Link>
	      							</span>
	      							) : (
	      							<span>
	      								<Link to={ `/editcontact/${contact.id}` } className="contact-icon contact-icon--blue">
			        						<i className="fas fa-edit" aria-hidden="true"></i>
			        					</Link>
			        					<Link onClick = { () => deleteHandler(contact.id) } to="#" className="contact-icon contact-icon--red">
			        						<i className="fa fa-trash" aria-hidden="true"></i>
			        					</Link>
			        					<Link to={ `/mycontacts/${contact.id}` } className="contact-icon">
			        						<button className = "viewButton">View</button>
			        					</Link>
			        				</span>
	      							) }
	      				</li>
	      			)
	      		})}
	      	</ul>

		</Page>
	)
}

export default Home