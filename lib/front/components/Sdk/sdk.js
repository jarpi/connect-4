import openSocket from 'socket.io-client'

let socket = null

class Sdk {

	constructor() {
    socket = !socket ? openSocket('http://localhost:8080') : socket
	}

  registerEvent(evt, cb) {
    // Call array of cb's (multiple listeners)
    socket.on(evt, cb);
  }

  emitEvt(evt, data) {
    socket.emit(evt, data)
  }

}

export default Sdk
