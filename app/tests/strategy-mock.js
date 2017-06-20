"use strict";

var passport = require('passport')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , util = require('util');

function StrategyMock() {
    this.name = 'mock';
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate(req) {
    var self = this;

    User.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if(err) {
            self.fail(err);
        } else {
            self.success(foundUser);
        }
    });
}

module.exports = StrategyMock;