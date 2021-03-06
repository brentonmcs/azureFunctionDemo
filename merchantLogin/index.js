﻿module.exports = function (context, req) {

    var jwt = require('jsonwebtoken');
    var dbUtils = require('../docDBUtils');

    if (!req.query.username) {
        context.res = {
            status: 400,
            body: "username is required"
        };
        context.done();
        return;
    }

    dbUtils.connect("smiledb", "merchants", context, function () {

        context.log(req.query.username);
        dbUtils.findArray({
            query: "SELECT * FROM root r  WHERE r.username = @username",
            parameters: [{
                name: '@username',
                value: req.query.username
            }]
        }, function (err, results) {

            if (err) {
                context.done(err);
                return;
            }
            if (results.length === 0) {
                context.res = {
                    status: 400,
                    body: "username or password is incorrect"
                };
            } else {

                var merchant = results[0];
                context.res = {
                    status: 200,
                    body: {
                        "id" : merchant.id,
                        "name" : merchant.name,
                        token: jwt.sign(results[0], 'supersecret')
                    }
                };
            }
            context.done();
        });
    });
};
