module.exports = function (context, req) {

    var jwt = require('jsonwebtoken');
    var dbUtils = require('./docDBUtils');

    if (!req.query.username) {
        context.res = {
            status: 400,
            body: "username is required"
        };
        context.done();
        return;
    }

    dbUtils.connect("smiledb", "merchants", context, function () {

        dbUtils.findArray({
            query: "SELECT * FROM root r  WHERE r.username = @username",
            parameters: [{
                name: '@username',
                value: req.query.username
            }]
        }, function (err, results) {

            if (err) {
                context.log(err);
            }
            if (results.length === 0) {
                context.res = {
                    status: 400,
                    body: "username or password is incorrect"
                };

            } else {
                context.res = {
                    status: 200,
                    body: {
                        token: jwt.sign(result[0], 'supersecret')
                    }
                };
            }
            context.done();
        });
    });
};
