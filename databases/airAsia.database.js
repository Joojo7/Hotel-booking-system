const mongoose = require('mongoose');

const mongodbURL =
    process.env.MONGODB_URL;
const db = mongoose.createConnection(mongodbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);
module.exports = db;
