"use strict";
module.exports = function(app) {
    var mainRouter = require('./routes.js');
    return jobsRouter()
        .then(function(router){
            app.use('/', router);
            return;
        });
};