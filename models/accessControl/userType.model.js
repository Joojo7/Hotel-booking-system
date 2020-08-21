const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');

const userTypeSchema = new mongoose.Schema({
    user_type: Number,
    description: String, // example: admin, expert...
    access_codes: [
        {
            type: String
        }
    ] // array of access_code_id
});

module.exports = db.model('user_type', userTypeSchema);
