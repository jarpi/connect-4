import React from 'react'
import sdk from '../Sdk/sdk.js'

class InvitationsList extends React.Component {

	constructor(props) {
		super(props)
    this.sdk = new sdk()
    this.state = {invitations: []}
    this.sdk.registerEvent('invite', data => {
			console.dir('invitation received')
      this.setState({invitations: [...this.state.invitations, JSON.parse(data).host]})
		})
    this.handleClick = userId => {
      console.dir('click ' + userId)
      this.sdk.emitEvt('inviteUser', JSON.stringify({user: userId}))
    }
	}

	render() {
    return (<div className="invitations-list"><h2>Invitations</h2><ul>{
      this.state.invitations.map(userId => {
        return <li key="{userId}" onClick={this.handleClick.bind(this, userId)}>{userId}</li>
      })}
    </ul></div>)
	}

}

export default InvitationsList
