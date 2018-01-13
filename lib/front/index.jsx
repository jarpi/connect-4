import React from 'react'
import ReactDOM from 'react-dom'
import Grid from './components/Grid'
import UsersList from './components/UsersList'
import InvitationsList from './components/Invitation'

ReactDOM.render(<Grid rows="6" cols="7"/>, document.getElementById('connect4-grid'))
ReactDOM.render(<UsersList/>, document.getElementById('connect4-user-list'))
ReactDOM.render(<InvitationsList/>, document.getElementById('connect4-invitation-list'))
