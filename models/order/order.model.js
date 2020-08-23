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
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            required: true
        },
        phone: {
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
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true }
    }
);

Schema.pre('save', function(next) {
    this.order_id = this._id; 
    next();
});

Schema.virtual('payment', {
    ref: 'payment', // The model to use
    localField: 'payment_id', // Find people where `localField`
    foreignField: 'payment_id', // is equal to `foreignField`
    justOne: true
});


Schema.plugin(mongooseSoftDelete, { 
    overrideMethods: 'all'
});

module.exports = db.model('order', Schema);
