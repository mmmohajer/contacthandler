import React, { useEffect } from 'react'
import { useImmerReducer} from 'use-immer'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Home from './components/Home'
import Footer from './components/Footer'
import About from './components/About'
import Thanks from './components/Thanks'
import CreateContact from './components/CreateContact'
import ViewSingleContact from './components/ViewSingleContact'
import FlashMessages from './components/FlashMessages'
import EditContact from './components/EditContact'

const App = () => {

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: [],
    user: {
      access_token: localStorage.getItem("appToken")
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': localStorage.getItem("adminAppToken")
    }
  }

  const appReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data.data
        break
      case "logout":
        draft.loggedIn = false
        break
      case "flashMessage":
        draft.flashMessages.push(action.value)
        break
      case "adminLogin":
        draft.headers.Authorization = action.value
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("appToken", state.user.access_token)
    } else {
      localStorage.removeItem("appToken")
    }
  }, [state.loggedIn])

  useEffect(() => {
    if (!localStorage.getItem("adminAppToken")) {
      adminLogin()
    } else {
      let adminToken = localStorage.getItem("adminAppToken")
      dispatch({type: "adminLogin", value: adminToken})
    }
  }, [state.headers])

  const adminLogin = async () => {
    let admin = new FormData();

    admin.append("app_name", "contact_application_csc")
    admin.append('username', "mmmohajer70")
    admin.append('password', "Pass4ContactApplication")

    try {
      const response = await Axios.post("/users/login", admin)
      let adminToken = `Bearer ${response.data.data.access_token}`
      localStorage.setItem("adminAppToken", adminToken)
      dispatch({type: "adminLogin", value: adminToken})
    } catch(err) {
      console.log(err)
    }
  }  

  return (
    <StateContext.Provider value = { state }>
      <DispatchContext.Provider value = { dispatch }>
        <BrowserRouter>
          <FlashMessages messages = { state.flashMessages }/>
          <Header />
          <Switch>
            <Route path = "/" exact>
              { state.loggedIn ? <Home /> : <HomeGuest /> }
            </Route>
            <Route path = "/create-contact">
              <CreateContact />
            </Route>
            <Route path = "/mycontacts/:id">
              <ViewSingleContact />
            </Route>
            <Route path = "/editcontact/:contactId">
              <EditContact />
            </Route>
            <Route path = "/about-app">
              <About />
            </Route>
            <Route path = "/thanks">
              <Thanks />
            </Route>
          </Switch>
          <Footer />    
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App;
