const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');
const mongooseSoftDelete = require('mongoose-delete');

const Schema = new mongoose.Schema(
    {
        room_id:String,
        room_name: {
            type: String,
            required: true
        },
        number_of_rooms: {
            type: Number,
            default: 1
        },
        hotel_id:{
            type: String,
            required: true
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

Schema.pre('save', function(next) {
    this.room_id = this._id; 
    this.created_by = currentUser.uid;
    next();
});

Schema.plugin(mongooseSoftDelete, { 
    overrideMethods: 'all'
});

module.exports = db.model('room', Schema);
