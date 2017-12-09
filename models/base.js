"use strict";

const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://localhost/payjo', {
  useMongoClient: true,
  /* other options */
});
db.then(function(db) {
  console.log("connects")
  /* Use `db`, for instance `db.model()`
   });
   // Or, if you already have a connection
   connection.openUri('mongodb://localhost/myapp', { /* options */

});


module.exports = db;
