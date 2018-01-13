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
        console.dir('client connected')
        users.push(socket)
        socket.on('disconnect', () => {
          console.dir('client disconnected')
          users = users.filter(soc => { soc.id === socket.id })
          console.dir(users)
        })
        socket.on('getUsersList', data => {
          console.dir('getUsersList')
          socket.emit("getUsersList", JSON.stringify(users.map(user => { return user.id})))
        })
        socket.on('inviteUser', data => {
          let userId = JSON.parse(data).user
          console.dir('inviteUser ' + userId)
          const sock = users
          .filter(user => { return user.id === userId })
          .reduce( acc => { return acc })
          if (!sock) {
            console.dir(userId + ' not found');
            return
          }
          console.dir(JSON.stringify({host: socket.id}))
          sock.emit("invite", JSON.stringify({host: socket.id}))
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
