var login = require('../index');
var assert = require('assert');

process.env.DocumentDb = "https://tesdocbmc.documents.azure.com:443/";
process.env.ApiKey = 'jPeCHS82RKY0XtWeKDIF6cFqFbDExNQlE0tZ06WEEFgYJRrRKJS2JmCaQViWbNzl9DI6N7SCkAFPVV9hfaqY4Q==';

describe("Merchant Login", function() {

  it("logs in successfully", function(done) {

    var assertCallback = function (err) {

      if (err) {
        done(err);
      } else {
        assert.equal(200, this.res.status);
        assert.equal(1, this.res.body.id);
        assert.equal('duface', this.res.body.name);
        done();
      }
    };
    var context = {
      done :  assertCallback,
      log : function (message) {
        console.log(message);
      },
      res : {}
    }

    login(context, { query : { "username" : "test123"}});
  });

});
