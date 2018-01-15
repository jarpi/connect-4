import React from 'react'
import sdk from '../Sdk/sdk.js'

class Grid extends React.Component {

	constructor(props) {
		super(props)
		this.state = {gameInfo:null}
		this.sdk = new sdk()
		this.sdk.registerEvent('userId', data => {
      console.dir(data)
			this.setState({myUserId: data})
    })
		this.sdk.registerEvent('invalidMove', _ => {
      console.dir('Invalid move')
    })
		this.sdk.registerEvent('winner', _ => {
      console.dir('You win')
    })
		this.sdk.registerEvent('gridChange', data => {
			console.dir('grid received')
			const gameInfo = JSON.parse(data)
			console.dir(this)
			this.setState({gameInfo: gameInfo})
		})
		this.handleMove = (col) => {
			if (this.state.gameInfo.turn !== this.state.myUserId) return console.log('Not your turn')
			const gameInfo = this.state.gameInfo
			gameInfo.moveCol = col
			this.sdk.emitEvt('move', JSON.stringify(gameInfo))
		}
	}

	getCols(row) {
		let cols = []
    for (let colNum=0; colNum<this.props.cols; colNum++) {
			const className = ['cell', (this.state.gameInfo && this.state.gameInfo.grid ?
				(!this.state.gameInfo.grid[row][colNum] ? '' :
				this.state.gameInfo.grid[row][colNum] === this.state.myUserId ? 'user-move' : 'opponent-move') : '')]
				.join(' ')
			cols.push(<div className={className} onClick={this.handleMove.bind(this, colNum)} key={colNum}></div>)
		}
    return cols
  }

	render() {
    let rows = []
    for (let rowNum=0;rowNum<this.props.rows;rowNum++) {
      rows.push(<div className='row' key={rowNum} id={'row' + rowNum}>{this.getCols(rowNum)}</div>)
    }
    return (<div id="grid">{rows}</div>)
	}

}

export default Grid
