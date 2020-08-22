const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');
const mongooseSoftDelete = require('mongoose-delete');

const Schema = new mongoose.Schema(
    {
        payment_id:String,
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: "pending"
        },
        method: {
            type: String,
            default: "CREDIT_CARD"
        },
        description: {
            type: String,
            required: true
        },
        total_amount: {
            type: Number,
            required: true
        },
        payment_date: {
            type: Date,
            default: Date.now()
        },
        credit_card: {
            type: String,
            default: ""
        }

    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

Schema.pre('save', function(next) {
    this.payment_id = this._id; 
    this.created_by = currentUser.uid;
    next();
});

Schema.plugin(mongooseSoftDelete, { 
    overrideMethods: 'all'
});

module.exports = db.model('payment', Schema);
