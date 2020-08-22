const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');
const mongooseSoftDelete = require('mongoose-delete');

const Schema = new mongoose.Schema(
    {
        order_id:String,
        hotel_id:{
            type: String,
            required: true
        },
        room_id: {
            type: String,
            required: true
        },
        number_of_guests: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        payment_id: {
            type: String,
            required: true
        },
        check_in_date: {
            type: Date,
            required: true
        },
        check_out_date: {
            type: Date,
            required: true
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

Schema.pre('save', function(next) {
    this.order_id = this._id; 
    this.created_by = currentUser.uid;
    next();
});

Schema.plugin(mongooseSoftDelete, { 
    overrideMethods: 'all'
});

module.exports = db.model('order', Schema);
