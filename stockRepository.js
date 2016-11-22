var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://heroku_jbj2b46s:voikrvavqqpmo7sj86199mbull@ds159387.mlab.com:59387/heroku_jbj2b46s';

var collectionPromise = MongoClient
    .connect(url, {db: {bufferMaxEntries: 0}})
    .then(function (db) {
        return db.collection('books_arkenia');
    });

module.exports = {
    stockUp: function (isbn, count) {
        return collectionPromise.then(function (collection) {
            collection.updateOne(
                {isbn: isbn},
                {isbn: isbn, count: count},
                {upsert: true}
            );
        });
    },
    findAll: function () {
        return collectionPromise
            .then(function (collection) {
                return collection.find({}).toArray();
            });
    },
    getCount: function (isbn) {
        return collectionPromise.then(function (collection) {
            return collection.find({"isbn": isbn}).limit(1).next();
        }).then(function (result) {
            if (result) {
                return result.count;
            } else {
                return null;
            }
        });
    }
};
