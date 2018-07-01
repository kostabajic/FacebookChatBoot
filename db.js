require('dotenv').load();
var mongoose = require('mongoose');
const MONGO_DB = process.env.MONGO_DB;

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_DB);

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));