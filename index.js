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
        socket.on('disconnect', () => {
          console.dir('client disconnected')
        })
      })
      ws.on('someEvt', (evt) => {
        console.dir('evt received' + evt)
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
