var login = require('../index');


describe("Color Code Converter", function() {

  var context = {
    log: function (message) {
      console.log(message);
    },
    done: function(err) {
      console.log('done -' + err);
      done();
    },
    res : function(obj) {
      console.log(obj);
    }
  }

  it("converts the basic colors", function(done) {
    login(context, { query : { "username" : "test123"}});
  });

});
