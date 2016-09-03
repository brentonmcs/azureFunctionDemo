var DocumentClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

var client = new DocumentClient(process.env.DocumentDb, {
    masterKey: process.env.ApiKey
});
var databaseId = "Patients";
var collectionId = "Patients";

var database = null;
var collection = null;

module.exports = function (context, req) {

    function init(initCallback) {

        if (collection) {
            initCallback();
            return;
        }
        docdbUtils.getOrCreateDatabase(client, databaseId, function (err, db) {
            if (err) {
                callback(err);
            } else {
                database = db;
                docdbUtils.getOrCreateCollection(client, database._self, collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
                        collection = coll;
                        initCallback();
                    }
                });
            }
        });
    }

    function find(coll) {
        client.queryDocuments(coll._self, {
            query: 'SELECT * FROM root r'
        }).toArray(function (err, results) {
            context.res = {
                status: 200,
                body: results.map(function (item) {
                    return { name :item.name, treatment : item.treatment}
                })
            };
            context.done();
        });
    }

    init(function () {
        find(collection);
    });
}
