module.exports = function (context) {

    var jwt = require('jsonwebtoken');

    context.res = {
        status: 200,
        body: {
            token : jwt.sign({merchantId: 123}, 'supersecret')
        }
    };

    context.done();
};
