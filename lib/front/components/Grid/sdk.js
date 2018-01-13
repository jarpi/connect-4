import openSocket from 'socket.io-client'

class Sdk {

	constructor() {
    this.socket = openSocket('http://localhost:8080')
	}

  registerEvents(cb) {
    this.socket.on('timer', timestamp => cb(null, timestamp));
    this.socket.emit('subscribeToTimer', 1000);
  }

}

export default Sdk
