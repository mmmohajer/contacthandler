import React, { Component } from 'react'
import Axios from 'axios'
import md5 from 'md5';
import QRCode from 'qrcode.react';

import StateContext from '../StateContext'

const initialState = {
  fname: '',
  lname: '',
  oname: '',
  email: '',
  birthDate: '',
  repTo: '',
  recEmail: '',
  phoneCall: '',
  startDate: '',
  endDate: '',
  sla: '',
  tweeterUsername: '',
  photo: '',
  pLan: '',
  md5Hash: '',
  assignedUsername: ''
}

export class SingleContactToPrint extends Component {

  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentDidMount() {
    this.getContact()
  }

  async getCurrentUser(assignedToId) {
    const headers = this.props.headers
    const response = await Axios.get("/users/read-all", { headers })
      let users = response.data.data
      let curUser = users.filter(newUser => {
        return (newUser.id === assignedToId)
      })
      this.setState({assignedUsername: curUser[0].username})
  }

  async getContact() {
    const userId = this.props.id
    const headers = this.props.headers
    let response = await Axios.get(`/contacts/read/${userId}`, { headers })
    this.setState({fname: response.data.data.first_name})
    this.setState({lname: response.data.data.last_name})
    this.setState({oname: response.data.data.organization_name})
    this.setState({email: response.data.data.primary_email})
    this.setState({birthDate: response.data.data.date_of_birth})
    if (response.data.data.reports_to > 0) {
      this.repContactFinder(response.data.data.reports_to)
    } else {
      this.setState({repTo: "No Contacts yet!"})
    }
    if (parseInt(response.data.data.email_opt_out) === 1) {
      this.setState({recEmail: "Yes"})
    } else {
      this.setState({recEmail: "No"})
    }
    if (parseInt(response.data.data.do_not_call) === 1) {
      this.setState({phoneCall: "Yes"})
    } else {
      this.setState({phoneCall: "No"})
    }
    this.setState({startDate: response.data.data.support_start_date})
    this.setState({endDate: response.data.data.support_end_date})
    this.setState({tweeterUsername: response.data.data.tweeter_username})
    this.setState({address: response.data.data.address_details})
    this.setState({photo: response.data.data.profile_picture})
    if (parseInt(response.data.data.language) === 1) {
      this.setState({pLan: "English"})
    } else {
      this.setState({pLan: "French"})
    }
    const md5HashCode = md5(response.data.data.id)
    this.setState({md5Hash: md5HashCode})
    this.getCurrentUser(response.data.data.assigned_to)
    this.setState({sla: response.data.data.sla_name})
  }

  async repContactFinder(repContactId) {
    const headers = this.props.headers
    let response = await Axios.get(`/contacts/read/${repContactId}`, { headers })
    this.setState({repTo: `${response.data.data.first_name} ${response.data.data.last_name}`})
  }

  render() {
    return (
     <>
      <table>
        <tbody>
        <tr>
          <td>First Name</td>
          <td>{ this.state.fname }</td>
        </tr>
        <tr>
          <td>Last Name</td>
          <td>{ this.state.lname }</td>
        </tr>
        <tr>
          <td>Assigned Username</td>
          <td>{ this.state.assignedUsername }</td>
        </tr>
        <tr>
          <td>Organization Name</td>
          <td>{ this.state.oname }</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{ this.state.email }</td>
        </tr>
        <tr>
          <td>Birth Date</td>
          <td>{ this.state.birthDate }</td>
        </tr>
        <tr>
          <td>Reports to</td>
          <td>{ this.state.repTo }</td>
        </tr>
        <tr>
          <td>Receive email from us?</td>
          <td>{ this.state.recEmail }</td>
        </tr>
        <tr>
          <td>Receive call from us?</td>
          <td>{ this.state.phoneCall }</td>
        </tr>
        <tr>
          <td>Start Date</td>
          <td>{ this.state.startDate }</td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>{ this.state.endDate }</td>
        </tr>
        <tr>
          <td>SLA</td>
          <td>{ this.state.sla }</td>
        </tr>
        <tr>
          <td>Tweeter Username</td>
          <td>{ this.state.tweeterUsername }</td>
        </tr>
        <tr>
          <td>Address</td>
          <td>{ this.state.address }</td>
        </tr>
        <tr>
          <td>Preferred Language</td>
          <td>{ this.state.pLan }</td>
        </tr>
        <tr>
          <td>Profile Photo</td>
          <td>{ this.state.photo }</td>
        </tr>
        </tbody>
      </table>
      <div className = "hashCode">
        <QRCode value= { `${this.state.md5Hash}` } />
      </div>
    </> 
    )
  }
}