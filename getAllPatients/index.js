var databaseId = "Patients";
var collectionId = "Patients";

module.exports = function (context, req) {

    require('./docdbUtils').connect(databaseId, collectionId, function () {
        findArray({
            query: 'SELECT * FROM root r'
        }, function (err, results) {

            if (err) {
                context.res = {
                    status: 500,
                    body: "Failed reading patients"
                }
                context.done(err);
            } else {
                context.res = {
                    status: 200,
                    body: results.map(function (item) {
                        return {
                            name: item.name,
                            treatment: item.treatment
                        }
                    })
                };
                context.done();
            }
        });
    });
}
