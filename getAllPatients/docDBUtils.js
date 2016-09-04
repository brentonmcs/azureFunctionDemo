var DocumentClient = require('documentdb').DocumentClient;

var database = null;
var collection = null;

var client = new DocumentClient(process.env.DocumentDb, {
    masterKey: process.env.ApiKey
});

function getOrCreateDatabase(client, databaseId, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id= @id',
        parameters: [{
            name: '@id',
            value: databaseId
        }]
    };

    client.queryDatabases(querySpec).toArray(function (err, results) {
        if (err) {
            callback(err);

        } else {
            if (results.length === 0) {
                var databaseSpec = {
                    id: databaseId
                };

                client.createDatabase(databaseSpec, function (err, created) {
                    callback(null, created);
                });

            } else {
                callback(null, results[0]);
            }
        }
    });
}

function getOrCreateCollection(client, databaseLink, collectionId, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: collectionId
        }]
    };

    client.queryCollections(databaseLink, querySpec).toArray(function (err, results) {
        if (err) {
            callback(err);

        } else {
            if (results.length === 0) {
                var collectionSpec = {
                    id: collectionId
                };

                client.createCollection(databaseLink, collectionSpec, function (err, created) {
                    callback(null, created);
                });

            } else {
                callback(null, results[0]);
            }
        }
    });
}
var DocDBUtils = {

    findArray: function (query, callback) {
        client.queryDocuments(collection._self, query).toArray(callback);
    },
    connect: function (databaseId, collectionId, initCallback) {

        if (collection) {
            initCallback();
            return;
        }

        getOrCreateDatabase(client, databaseId, function (err, db) {
            if (err) {
                callback(err);
            } else {
                database = db;
                getOrCreateCollection(client, database._self, collectionId, function (err, coll) {
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
};

module.exports = DocDBUtils;
