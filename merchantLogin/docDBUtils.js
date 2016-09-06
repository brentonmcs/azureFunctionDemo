var DocumentClient = require('documentdb').DocumentClient;

var database = null;
var collection = null;
var _context;
var client = new DocumentClient("https://tesdocbmc.documents.azure.com:443/", {
    masterKey: 'vhqzwxpv0w4ThvqA8xt6jBtOIBMTL25FI98Www10c1GSAkL0q9L0A72l4AkAscv0qkgZQPSJvGurENjSXr0F6A=="'
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
            _context.log(err);
            _context.done(err);
        } else {
            if (results.length === 0) {
                client.createDatabase({
                    id: databaseId
                }, function (err2, created) {
                    _context.log(err2);
                    _context.log(created);
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
            _context.log(err);
            callback(err);

        } else {
            if (results.length === 0) {
                var collectionSpec = {
                    id: collectionId
                };

                client.createCollection(databaseLink, collectionSpec, callback);

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
    connect: function (databaseId, collectionId, context, initCallback) {

        if (collection) {
            initCallback();
            return;
        }

        _context = context;
        getOrCreateDatabase(client, databaseId, function (err, db) {

            if (err) {
                _context.log(err);
                callback(err);
            } else {
                getOrCreateCollection(client, db._self, collectionId, function (err, coll) {
                    if (err) {
                        _context.log(err);
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
