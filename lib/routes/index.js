"use strict";
var express = require('express');
var router = express.Router();

function setUp() {
  router.get('/test', (req, res, next) => {
    res.send('ok')
  })
}

module.exports = function(){
    return Promise.resolve()
        .then(function() {
            return setUp();
        })
        .then(function() {
            return router;
        });
};
