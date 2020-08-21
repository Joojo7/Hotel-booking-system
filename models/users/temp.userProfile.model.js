const mongoose = require('mongoose');
const db = require('../../databases/phinonics.database');

const userProfileSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        username: String,
        password: String,
        avatar: String,
        email: String,
        userType: Number,
        phone: String,
        tokens: Array,
        old_uid: String,
        lastUpdate: String,
        countryCode: String,
        level: Array,
        access_group: mongoose.Schema.Types.ObjectId,
        extra_access_codes: [mongoose.Schema.Types.ObjectId],
        uid: String,
        emailVerified: String,
        phoneVerified: String
    },
    {
        collection: 'user_profilesxx',
        versionKey: false
    }
);

module.exports = db.model('userProfilexx', userProfileSchema);
