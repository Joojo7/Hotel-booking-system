const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');

const accessCodeSchema = mongoose.Schema({
    description: String,
    code: {
        type: String,
        unique: true
    }
});

module.exports = db.model('access_code', accessCodeSchema);
