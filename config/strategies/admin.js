"use strict";

var passport = require('passport')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , config = require('./../config')
    , util = require('util')
    , LocalStrategy = require('passport-local').Strategy
    , User = require('mongoose').model('User');

module.exports = function () {
    // Use local strategy
    passport.use('admin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            if (username === 'admin' && password === config.admin.password) {
                User.findOne({
                    username: username
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: 'Unknown user'
                        });
                    }

                    done(null, user);
                });
            } else {
                done(null, false, {
                    message: 'Invalid credentials'
                });
            }
        }));
};