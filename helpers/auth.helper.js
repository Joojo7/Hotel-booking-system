const token = require('./token.helper');
const {
    BARCODE_EXSIST,
    EMAIL_PHONE_EXSIST
} = require('../errorDefinition/errors.map');

// Helpers
const userHelper = require('./user.helper');
const isEmpty = require('lodash/isEmpty');
class Auth {
    static async signup({ user, clientKey, platform, app_version }) {
        // check if user already exists
        let userExixst = await userHelper.userExists(
            user.email.trim().toLowerCase(),
            user.phone.trim()
        );

        if (userExixst) {
            throw EMAIL_PHONE_EXSIST
        }


        let password = await userHelper.hashPassword(user.password.trim());

        user.client = clientKey;
        let registeredUser = await userHelper.create(user, password);


        // append platform and version to user obj
        registeredUser.platform = platform;
        registeredUser.app_version = app_version;
        let { generatedToken, refreshToken } = await token.generate(
            registeredUser
        );
        let data = {
            uid: registeredUser.uid,
            email: registeredUser.email,
            username: registeredUser.username,
            country_code: registeredUser.country_code,
            phone: registeredUser.phone,
            user_type: registeredUser.user_type,
            token: generatedToken.token,
            refresh_token: refreshToken
        };


        return data;
    }

    static async signuptasker({ tasker, clientKey, platform, app_version }) {
        // check if tasker already exists
        let taskerExixst = await taskerHelper.taskerExists(
            tasker.email.trim().toLowerCase(),
            tasker.phone.trim()
        );

        if (taskerExixst) {
            throw EMAIL_PHONE_EXSIST
        }


        let password = await taskerHelper.hashPassword(tasker.password.trim());

        tasker.client = clientKey;
        let registeredTasker = await taskerHelper.create(tasker, password);

        // append platform and version to tasker obj
        registeredTasker.platform = platform;
        registeredTasker.app_version = app_version;
        let { generatedToken, refreshToken } = await token.generate(
            registeredTasker
        );
        let data = {
            uid: registeredTasker.uid,
            email: registeredTasker.email,
            username: registeredTasker.username,
            country_code: registeredTasker.country_code,
            phone: registeredTasker.phone,
            tasker_type: registeredTasker.tasker_type,
            token: generatedToken.token,
            refresh_token: refreshToken
        };


        return data;
    }


}

module.exports = Auth;
