const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');
const validator = require('validator');
const mongooseSoftDelete = require('mongoose-delete');


const UserProfileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            minlength: 1,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not valid email.'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        uid: {
            type: String,
            required: true,
            index: true
        },
        username: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            unique: false,
            trim: true,
            required: true
        },
        phone_numbers: [
            {
                type: String,
                trim: true
            }
        ],
        ic_number: {
            type: String,
            trim: true
        },
        rate: {
            type: Number,
            trim: true
        },
        gender: {
            type: String,
            trim: true
        },
        country_code: {
            type: String,
            unique: false,
            trim: true,
            required: true
        },

        user_type: {
            required: true,
            trim: true,
            type: Number,
            default: 0
        },
        avatar: {
            type: String,
            required: false
        },
        last_update: {
            type: Date,
            required: true,
            default: ''
        },
        wechat_id: String,
        chit_chat_id: String,
        registration_date: {
            type: Date,
            default: new Date()
        },

        is_email_verified: {
            type: Boolean,
            required: true,
            default: false
        },
        is_phone_verified: {
            type: Boolean,
            required: true,
            default: false
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true
        },
        location: {
            address: String,
            state: String,
            country: String,
            postcode: String
        },
        tokens: [
            {
                access: {
                    type: String,
                    required: true
                },
                platform: String,
                app_version: String,
                expiry_date: {
                    type: String,
                    required: true
                },
                vehicles: [],
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        refresh_token: String,
        notification_tokens: [{ token: String, device_id: String }],
        extra_access_codes: [String],
        interests: [String],
        reset_password_token: String,
        reset_password_token_expire_at: Date,
        email_validation_token: String,
        updated_by: String
    },
    {
        collection: 'user_information', 
        versionKey: false
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } 
);

UserProfileSchema.pre('save', function(next) {
    next();
});

UserProfileSchema.plugin(mongooseSoftDelete, {
    overrideMethods: 'all'
});

const UserProfile = db.model('user_information', UserProfileSchema);

module.exports = {
    UserProfile
};
