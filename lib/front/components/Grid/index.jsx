import React from 'react'

class Grid extends React.Component {

	constructor(props) {
		super(props)
	}

	getCells() {
		let cells = []
   	for (let x=0; x<7; x++){
			cells.push(<div className='cell' key={x}></div>)
		}
		return cells
	}

	render() {
		let rows = []
		for (let i=0;i<6;i++) {
			rows.push(<div className='row' key={i} id={"row" + i}>{this.getCells()}</div>)
		}
		return (<div id="grid">{rows}</div>)
	}

}

export default Grid
