module.exports = function(){
    return Promise.resolve()
        .then(function() {
            return EndPoint();
        })
        .then(function() {
            return router;
        });
};
