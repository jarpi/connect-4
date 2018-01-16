import openSocket from 'socket.io-client'

let socket = null

class Sdk {

	constructor() {
    // Set it by config
		const uri = `http://' + ${process.env.HOST_NAME || 'localhost'}` + ':8080'
    socket = !socket ? openSocket(uri) : socket
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
