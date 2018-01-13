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
	}

	render() {
    return (<div className="users-list"><ul>{
      this.state.usersList.map(userId => {
        return <li key="{userId}">{userId}</li>
      })}
    </ul></div>)
	}

}

export default UsersList
