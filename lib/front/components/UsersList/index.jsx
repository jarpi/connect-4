import React from 'react'
import sdk from '../Sdk/sdk.js'

class UsersList extends React.Component {

	constructor(props) {
		super(props)
    this.sdk = new sdk()
    this.state = {usersList: []}
    this.sdk.registerEvent('getUsersList', data => {
      this.setState({usersList:JSON.parse(data)})
    })
    this.sdk.emitEvt('getUsersList')
    this.handleClick = userId => {
      console.dir('click ' + userId)
      this.sdk.emitEvt('inviteUser', JSON.stringify({user: userId}))
    }
	}

	render() {
    return (<div className="users-list"><h2>Users list</h2><ul>{
      this.state.usersList.map(userId => {
        return <li key="{userId}" onClick={this.handleClick.bind(this, userId)}>{userId}</li>
      })}
    </ul></div>)
	}

}

export default UsersList
