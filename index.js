"use strict"
/* jshint node: true */
/* global require, Promise, console, process */
let express = require('express')
let mongoose = require('mongoose')
let config = require('./lib/config.json')
let routes = require('./lib/routes/index.js')
let app = express()
let server = require('http').createServer(app)
let ws = require('socket.io')(server)

let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let users = []
let gamesInProgress = {}

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
            extended: false
}))
app.use(bodyParser.json())
mongoose.Promise = global.Promise
let port = process.env.port || 8080

function initHttp() {
    return new Promise(function(resolve, reject) {
        server.listen(port, function(err) {
            if (err) {
                return reject(err)
            }
                return resolve(true)
        })
    })
}

function initDB() {
    return new Promise(function(resolve, reject) {
        mongoose.connection.on('error', function(err){
            console.dir(err)
        })

        mongoose.connection.once('open', function(){
            console.log('Connection to DB initialized!')
        })

        mongoose.connect(config.db_host, function(err){
            if (err) {
                return reject(err)
            }
            return resolve(true)
        })
    })
}

initDB()
    .then(function() {
        console.log('app initialized on port ' + port)
    })
    .then(function(){
      // Init websocket events
      ws.on('connection', (socket) => {
        socket.emit('userId', socket.id)
        console.dir('client connected')
        users.push(socket)
        users.forEach(user => {
          user.emit("getUsersList", JSON.stringify(users
            .filter(soc => { return soc.id !== user.id })
            .map(user => { return user.id })))
        })
        socket.on('disconnect', () => {
          console.dir('client disconnected')
          users = users.filter(soc => { return soc.id !== socket.id })
          users.forEach(user => {
            user.emit("getUsersList", JSON.stringify(users
              .filter(soc => { return soc.id !== user.id })
              .map(user => { return user.id })))
          })
        })
        socket.on('getUsersList', data => {
          console.dir('getUsersList')
          const opponents = users
          .map(user => { return user.id })
          .filter( userId => { return userId !== socket.id })
          console.dir('opponents')
          console.dir(opponents)
          socket.emit("getUsersList", JSON.stringify(opponents))
        })
        socket.on('inviteUser', data => {
          let userId = JSON.parse(data).user
          console.dir('inviteUser ' + userId)
          const sock = users
          .find( (opponent) => { return opponent.id === userId })
          if (!sock) {
            console.dir(userId + ' not found');
            return
          }
          console.dir(JSON.stringify({host: socket.id}))
          sock.emit("invite", JSON.stringify({host: socket.id}))
        })
        socket.on('acceptInvite', data => {
          let userId = JSON.parse(data).user
          console.dir('invitation accepted src: ' + socket.id + ' dst: ' + userId)
          const gameId = socket.id + '/' + userId
          gamesInProgress[gameId] = {
            grid:Array(6).fill([]).map(_ => {return Array(7).fill(0)}),
            turn: socket.id,
            gameId: gameId
          }
          const userIdSock = users.find( user => { return user.id === userId } )
          socket.emit('gridChange', JSON.stringify(gamesInProgress[gameId]))
          if (userIdSock) userIdSock.emit('gridChange', JSON.stringify(gamesInProgress[gameId]))
        })
        socket.on('move', data => {
          const gameInfo = JSON.parse(data)
          const currentGameInfo = gamesInProgress[gameInfo.gameId]
          console.dir('move received')
          console.dir(gameInfo)
          console.dir(currentGameInfo)
          const row = currentGameInfo.grid.reduce((acc, r, i) => {
    				return (!r[gameInfo.moveCol] ? i : acc)
    			}, null)
          if (!row) return socket.emit('invalidMove')
    			currentGameInfo.grid[row][gameInfo.moveCol] = socket.id
          const players = currentGameInfo.gameId.split('/')
          const opponentId = players.find(p => { return p !== currentGameInfo.turn })
          const opponentSocket = users.find(s => { return s.id === opponentId })
          currentGameInfo.turn = opponentId
          const gameInfoJson = JSON.stringify(currentGameInfo)
          socket.emit('gridChange', gameInfoJson)
          opponentSocket.emit('gridChange', gameInfoJson)
        })
      })
      return
    })
    .then(function() {
        return routes(app)
    })
    .then(initHttp)
    .catch(function(err) {
        console.dir(err)
    })
