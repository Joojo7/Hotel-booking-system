const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');
const mongooseSoftDelete = require('mongoose-delete');

const Schema = new mongoose.Schema(
    {
        hotel_id:String,
        hotel_name: {
            type: String,
            required: true
        },
        number_of_rooms: {
            type: Number,
            required: true
        },
        stars: Number,
        address:  {
            type: String,
            required: true
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

Schema.pre('save', function(next) {
    this.hotel_id = this._id; 
    this.created_by = currentUser.uid;
    next();
});

Schema.plugin(mongooseSoftDelete, { 
    overrideMethods: 'all'
});

module.exports = db.model('hotel', Schema);
