import React, { useContext, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import { useImmerReducer } from 'use-immer'
import { CSSTransition } from 'react-transition-group'
import Axios from 'axios'
import { withRouter, useParams } from 'react-router-dom'

import "react-datepicker/dist/react-datepicker.css";


import Page from './Page'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const EditContact = ({ history }) => {
	const appDispatch = useContext(DispatchContext)
	const { headers, user } = useContext(StateContext)
	const { contactId } = useParams()

	const initialState = {
		first_name: {
			value: "",
			hasErrors: false,
			message: ""
		},
		last_name: {
			value: "",
			hasErrors: false,
			message: ""
		},
		org_name: {
			value: ""
		},
		email: {
			value: "",
			hasErrors: false,
			message: ""
		},
		birth_date: {
			value: new Date()
		},
		report_to: {
			value: "-1"
		},
		start_date: {
			value: new Date()
		},
		end_date: {
			value: new Date()
		},
		sla: {
			value: ""
		},
		tweeter: {
			value: ""
		},
		address: {
			value: ""
		},
		p_lan: {
			value: "1"
		},
		email_receive: {
			value: false
		},
		phone_call: {
			value: false
		},
		photo_file: "",
		submitCount: 0,
		currentId: ""
	}

	const [allContacts, setAllContacts] = useState([])

	const contactReducer = (draft, action) => {
		switch (action.type) {
			case "fnameImmediately":
				draft.first_name.hasErrors = false
				draft.first_name.value = action.value
				if (draft.first_name.value.length > 30) {
          			draft.first_name.hasErrors = true
					draft.first_name.message = "First name cannot exceed 30 characters."
				}
				if (draft.first_name.value && !/^([a-zA-Z ]+)$/.test(draft.first_name.value)) {
          			draft.first_name.hasErrors = true
          			draft.first_name.message = "First name can only contain letters."
        		}
        		return
        	case "fnameAfterDelay":
        		if (draft.first_name.value.length < 2) {
          			draft.first_name.hasErrors = true
          			draft.first_name.message = "First name must be at least 2 characters."
        		}
				return

			case "lnameImmediately":
				draft.last_name.hasErrors = false
				draft.last_name.value = action.value
				if (draft.last_name.value.length > 30) {
          			draft.last_name.hasErrors = true
					draft.last_name.message = "Last name cannot exceed 30 characters."
				}
				if (draft.last_name.value && !/^([a-zA-Z ]+)$/.test(draft.last_name.value)) {
          			draft.last_name.hasErrors = true
          			draft.last_name.message = "Last name can only contain letters."
        		}
        		return
        	case "lnameAfterDelay":
        		if (draft.last_name.value.length < 2) {
          			draft.last_name.hasErrors = true
          			draft.last_name.message = "Last name must be at least 2 characters."
        		}
				return

			case "onameImmediately":
				draft.org_name.value = action.value
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
				return

			case "birthDateImmediately":
				draft.birth_date.value = action.value
        		return

        	case "reportToImmediately":
				draft.report_to.value = action.value
        		return

        	case "startDateImmediately":
				draft.start_date.value = action.value
        		return

        	case "endDateImmediately":
				draft.end_date.value = action.value
        		return

        	case "slaImmediately":
				draft.sla.value = action.value
        		return

        	case "tweeterImmediately":
				draft.tweeter.value = action.value
        		return

        	case "addressImmediately":
				draft.address.value = action.value
        		return

        	case "pLanImmediately":
				draft.p_lan.value = action.value
        		return

        	case "emailRecieveImmediately":
				draft.email_receive.value = action.value
        		return

        	case "phoneCallImmediately":
				draft.phone_call.value = action.value
        		return

        	case "photoFileImmediately":
				draft.photo_file = action.value
        		return

        	case "currentIdFinder":
				draft.currentId = action.value
        		return

        	case "submitForm":
        		if (!draft.first_name.hasErrors && !draft.last_name.hasErrors && !draft.email.hasErrors) {
        			draft.submitCount++
        		}
		}
	}

	const [state, dispatch] = useImmerReducer(contactReducer, initialState)

	useEffect(() => {
    	getContacts()
    	getCurrentUser()
    	getCurrentContact()
  	}, [])

	useEffect(() => {
    	if (state.first_name.value) {
      		const delay = setTimeout(() => dispatch({type: "fnameAfterDelay"}), 800)
      		return () => clearTimeout(delay)
    	}
  	}, [state.first_name.value])

  	useEffect(() => {
    	if (state.last_name.value) {
      		const delay = setTimeout(() => dispatch({type: "lnameAfterDelay"}), 800)
      		return () => clearTimeout(delay)
    	}
  	}, [state.last_name.value])

  	useEffect(() => {
    	if (state.email.value) {
      		const delay = setTimeout(() => dispatch({type: "emailAfterDelay"}), 800)
      		return () => clearTimeout(delay)
    	}
  	}, [state.email.value])

  	useEffect(() => {
  		if (state.submitCount) {
  			contactUpdated()
  		}
  	}, [state.submitCount])

  	const getContacts = async () => {
  		try {
  			let response = await Axios.get("/contacts/read-all", { headers })
  			let contactsData = response.data.data
  			let contactsInfo = []
    		contactsData.map(({ id, first_name, last_name, is_deleted }) => {
    			if (!Boolean(parseInt(is_deleted))) {
    				return setAllContacts(prev => prev.concat({id, first_name, last_name}))
    			}
    		})
  		} catch (err) {
  			console.log(err)
  		}
  	}

  	const getCurrentUser = async () => {
		const response = await Axios.get("/users/read-all", { headers })
    	let users = response.data.data
    	let curUser = users.filter(newUser => {
      	return (newUser.access_token == user.access_token)
    	})

    	dispatch({type: "currentIdFinder", value: curUser[0].id})
	}

  	const contactUpdated = async () => {
  		let newUser = new FormData();

	    newUser.append('id', contactId)
	    newUser.append('first_name', state.first_name.value)
	    newUser.append('last_name', state.last_name.value)
	    newUser.append('organization_name', state.org_name.value)
	    newUser.append('primary_email', state.email.value)
	    newUser.append('date_of_birth', formatDate(state.birth_date.value))
	    newUser.append('reports_to', parseInt(state.report_to.value))
	    newUser.append('do_not_call', booleanConerterToInt(state.phone_call.value))
	    newUser.append('email_opt_out', booleanConerterToInt(state.email_receive.value))
	    newUser.append('assigned_to', state.currentId)
	    newUser.append('support_start_date', formatDate(state.start_date.value))
	    newUser.append('support_end_date', formatDate(state.end_date.value))
	    newUser.append('sla_name', state.sla.value)
	    newUser.append('tweeter_username', state.tweeter.value)
	    newUser.append('address_details', state.address.value)
	    newUser.append('profile_picture', state.photo_file)
	    newUser.append('language', parseInt(state.p_lan.value))

	    try {
	    	const response = await Axios.post(`/contacts/update/${contactId}`,  newUser, { headers })
      		appDispatch({type: "flashMessage", value: "Congrats! Your contact has been successfully updated!"})
      		history.push("/")
	    } catch (err) {
	    	console.log(err)
	    }
	    
  	}

  	const formatDate = (date) => {
    	var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    	if (month.length < 2) 
        	month = '0' + month;
    	if (day.length < 2) 
        	day = '0' + day;

    	return [year, month, day].join('-');
	}

	const booleanConerterToInt = (bool) => bool ? 1 : 0

	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch({type: "fnameImmediately", value: state.first_name.value})
	    dispatch({type: "fnameAfterDelay", value: state.first_name.value})
	    dispatch({type: "lnameImmediately", value: state.last_name.value})
	    dispatch({type: "lnameAfterDelay", value: state.last_name.value})
	    dispatch({type: "emailImmediately", value: state.email.value})
	    dispatch({type: "emailAfterDelay", value: state.email.value})
	    dispatch({type: "submitForm"})
	    window.scrollTo(0, 0)
	}

	const getCurrentContact = async () => {
		let response = await Axios.get(`/contacts/read/${contactId}`, { headers })
		dispatch({type: "fnameImmediately", value: response.data.data.first_name})
		dispatch({type: "lnameImmediately", value: response.data.data.last_name})
		dispatch({type: "onameImmediately", value: response.data.data.organization_name})
		dispatch({type: "emailImmediately", value: response.data.data.primary_email})
		dispatch({type: "birthDateImmediately", value: new Date(response.data.data.date_of_birth)})
		dispatch({type: "reportToImmediately", value: response.data.data.reports_to})
		dispatch({type: "startDateImmediately", value: new Date(response.data.data.support_start_date)})
		dispatch({type: "startEndImmediately", value: new Date(response.data.data.support_end_date)})
		dispatch({type: "slaImmediately", value: response.data.data.sla_name})
		dispatch({type: "tweeterImmediately", value: response.data.data.tweeter_username})
		dispatch({type: "addressImmediately", value: response.data.data.address_details})
		dispatch({type: "pLanImmediately", value: response.data.data.language})
		dispatch({type: "photoFileImmediately", value: response.data.data.profile_picture})
		dispatch({type: "emailRecieveImmediately", value: Boolean(parseInt(response.data.data.email_opt_out))})
		dispatch({type: "phoneCallImmediately", value: Boolean(parseInt(response.data.data.do_not_call))})
	}

	return (
		<Page title = "Update Info">
			<form onSubmit = { handleSubmit }>
	        	<div className="form-group">
	            	<label htmlFor="fname-register" className="text-muted mb-1 required">
	                	<small>First Name</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "fnameImmediately", value: e.target.value}) } id="fname-register" name="name" className="form-control" type="text" placeholder="Your first name" autoComplete="off" value = { state.first_name.value }/>
	            	<CSSTransition in={state.first_name.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                		<div className="alert alert-danger small liveValidateMessage">{state.first_name.message}</div>
              		</CSSTransition>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="lname-register" className="text-muted mb-1 required">
	                	<small>Last Name</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "lnameImmediately", value: e.target.value}) } id="lname-register" name="name" className="form-control" type="text" placeholder="Your last name" autoComplete="off" value = { state.last_name.value }/>
	            	<CSSTransition in={state.last_name.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                		<div className="alert alert-danger small liveValidateMessage">{state.last_name.message}</div>
              		</CSSTransition>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="oname-register" className="text-muted mb-1">
	                	<small>Organization Name</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "onameImmediately", value: e.target.value}) } id="oname-register" name="name" className="form-control" type="text" placeholder="Your organization name" autoComplete="off" value = { state.org_name.value }/>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="email-register" className="text-muted mb-1 required">
	                	<small>Email</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "emailImmediately", value: e.target.value}) } id="email-register" name="name" className="form-control" type="text" placeholder="Your primary email address" autoComplete="off" value = { state.email.value }/>
	            	<CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                		<div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              		</CSSTransition>
	            </div>

	            <div className="form-group">
	            	<label className="text-muted mb-1 required">
	                	<small>Birth Date</small>
	              	</label>
	              	<div className="form-group">
	              		<DatePicker
			            	selected = { state.birth_date.value }
			            	onChange = { date => dispatch({type: "birthDateImmediately", value: date}) }
			            	dropdownMode="select"
			            	showMonthDropdown
			            	showYearDropdown
			            	adjustDateOnChange
						/>
	              	</div>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="reports-register" className="text-muted mb-1">
	                	<small>To whom contact would you like to report?</small>
	              	</label>
	            	<select onChange = { e => dispatch({type: "reportToImmediately", value: e.target.value}) } id="reports-register" name="name" className="form-control" value = { state.report_to.value }>
	            		<option value = "-1" > Choose a contact </option>
	            		{ allContacts.length ? (
	            				allContacts.map(({ id, first_name, last_name }) => {
	            					return <option key = { id } value = { `${id}` }> { first_name } { last_name } </option>
	            				})
	            			) : (
	            				<option value = "-2" > No contacts yet! </option>
	            			)  
	            		}
	            	</select>
	            </div>

	            <div className="form-group">
	            	<label className="text-muted mb-1">
	                	<small>Support Start Date?</small>
	              	</label>
	              	<div className="form-group">
	              		<DatePicker
			            	selected = { state.start_date.value }
			            	onChange = { date => dispatch({type: "startDateImmediately", value: date}) }
			            	dropdownMode="select"
			            	showMonthDropdown
			            	showYearDropdown
			            	adjustDateOnChange
						/>
	              	</div>
	            </div>

	            <div className="form-group">
	            	<label className="text-muted mb-1">
	                	<small>Support End Date</small>
	              	</label>
	              	<div className="form-group">
	              		<DatePicker
			            	selected = { state.end_date.value }
			            	onChange = { date => dispatch({type: "endDateImmediately", value: date}) }
			            	dropdownMode="select"
			            	showMonthDropdown
			            	showYearDropdown
			            	adjustDateOnChange
						/>
	              	</div>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="sla-register" className="text-muted mb-1">
	                	<small>Related SLA</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "slaImmediately", value: e.target.value}) } id="sla-register" name="name" className="form-control" type="text" placeholder="SLA" autoComplete="off" value = { state.sla.value }/>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="tweeter-register" className="text-muted mb-1">
	                	<small>Tweeter Username</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "tweeterImmediately", value: e.target.value}) } id="tweeter-register" name="name" className="form-control" type="text" placeholder="Your tweeter username" autoComplete="off" value = { state.tweeter.value } />
	            </div>

	            <div className="form-group">
	            	<label htmlFor="address-register" className="text-muted mb-1">
	                	<small>Address</small>
	              	</label>
	            	<input onChange = { e => dispatch({type: "addressImmediately", value: e.target.value}) } id="oname-register" name="name" className="form-control" type="text" placeholder="Your address" autoComplete="off" value = { state.address.value }/>
	            </div>

	            <div className="form-group">
	            	<label htmlFor="reports-register" className="text-muted mb-1">
	                	<small>What is your preferred language?</small>
	              	</label>
	            	<select onChange = { e => dispatch({type: "pLanImmediately", value: e.target.value}) } id="reports-register" name="name" className="form-control" value = {state.p_lan.value}>
	            		<option value="1"> English </option>
	            		<option value="2"> French </option>
	            	</select>
	            </div>

	            <div className="form-group">
		            <label className="text-muted mb-1 photo-label">
	          			Profile Photo
	       			</label>
	       			<input
	       				onChange = { e => dispatch({type: "photoFileImmediately", value: e.target.files[0].name}) }
				        type="file"
				        multiple
				        accept="images/*"
				    />
       			</div>

	            <div className="form-group">
	            <input onChange = { e => dispatch({type: "phoneCallImmediately", value: e.target.checked}) } type="checkbox" id="receive-email" name="receive-email" className="form-checkbox" checked = { state.email_receive.value ? true : false}/>
	            <label htmlFor="receive-email" className="checkbox-label">
	                	<small>Receive emails from us?</small>
	            </label>
	            </div>

	            <div className="form-group">
	            <input onChange = { e => dispatch({type: "phoneCallImmediately", value: e.target.checked}) } type="checkbox" id="phone-call" name="phone-call" className="form-checkbox" checked = { state.phone_call.value ? true : false}/>
	            <label htmlFor="phone-call" className="checkbox-label">
	                	<small>Receive phone calls from us?</small>
	            </label>
	            </div>
	            		
	            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
	            	Update Information
	            </button>
	        </form>
      	</Page>
	)
}

export default withRouter(EditContact)