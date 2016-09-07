module.exports = function (context, req) {

    var dbUtils = require('../docDBUtils');
    var bcrypt = require('bcrypt-nodejs');
    const saltRounds = 10;

    if (req.body.name && req.body.username && req.body.password) {
        dbUtils.connect("smiledb", "merchants", context, function () {

            var doc = {
                username: req.body.username,
                name: req.body.name
            };
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    doc.passwordHash = hash;

                    context.log(doc);
                    dbUtils.insertDocument(doc,context, function() {
                        context.done();
                    });
                });
            });

        })
    } else {
        context.res = {
            status: 400,
            "body": 'body requires name, username and password'
        }
        context.done();
    }
};
