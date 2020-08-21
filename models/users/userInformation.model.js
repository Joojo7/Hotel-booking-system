const mongoose = require('mongoose');
const db = require('../../databases/airAsia.database');

const UserInformationSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        fisrt_name: {
            type: String,
            trim: true
        },
        last_name: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            trim: true
        },
        iid: {
            type: String
        },
        primary_address: {
            address: {
                type: String,
                trim: true
            },
            street: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            postal_code: {
                type: String,
                trim: true
            }
        },
        addresses: [
            {
                address: {
                    type: String,
                    trim: true
                },
                street: {
                    type: String,
                    trim: true
                },
                city: {
                    type: String,
                    trim: true
                },
                state: {
                    type: String,
                    trim: true
                },
                postal_code: {
                    type: String,
                    trim: true
                }
            }
        ],
        level: String,
        phones: [
            {
                country_code: {
                    type: String,
                    trim: true
                },
                phone: {
                    type: String,
                    trim: true
                }
            }
        ],
        primary_vehicle: {
            brand: {
                type: String,
                trim: true
            },
            model: {
                type: String,
                trim: true
            },
            color: {
                type: String,
                trim: true
            },
            plate_number: {
                type: String,
                trim: true
            },
            manufacturing_date: {
                type: String,
                trim: true
            }
        },
        vehicles: [
            {
                brand: {
                    type: String,
                    trim: true
                },
                model: {
                    type: String,
                    trim: true
                },
                color: {
                    type: String,
                    trim: true
                },
                plate_number: {
                    type: String,
                    trim: true
                },
                manufacturing_date: {
                    type: String,
                    trim: true
                }
            }
        ],
        emails: [String]
    },
    {
        collection: 'user_informationxx',
        versionKey: false
    }
);

const UserInformation = db.model('user_informationxx', UserInformationSchema);

module.exports = {
    UserInformation
};
