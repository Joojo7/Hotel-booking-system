// Packages
const token = require('../../helpers/token.helper');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const validator = require('validator');
const {
    USER_NOT_FOUND,
} = require('../../errorDefinition/errors.map');

// Helpers
const userHelper = require('../../helpers/user.helper');

const response = require('../../helpers/response.helper');
const TokenHelper = require('../../helpers/token.helper');
const AuthHelper = require('../../helpers/auth.helper');

class Auth {

    static async signin(req, res) {
        
        let result = null;
        try {
            if (validator.isEmail(req.body.email_phone.trim())) {
                result = await userHelper.findByEmail(
                    req.body.email_phone.trim().toLowerCase(),
                    req.body.password.trim()
                );
            } else if (
                validator.isMobilePhone(req.body.email_phone.trim(), 'any')
            ) {
                result = await userHelper.findByPhone(
                    req.body.email_phone.trim(),
                    req.body.password.trim()
                );
            } else {
                return res.sendError('0015', req.header('languageId'));
            }
        } catch (e) {
            console.log(e);
            return res.sendError('-1', req.header('languageId'));
        }

        if (!result) {
            return res.sendError('0017', req.header('languageId'));
        }

        try {
            // append platform and version to user obj
            result.platform = req.header('Platform');
            result.app_version = req.header('App-Version');

            let { generatedToken, refreshToken } = await token.generate(result);
            let data = {
                uid: result.uid,
                email: result.email,
                username: result.username,
                avatar: result.avatar,
                is_email_verified: result.is_email_verified,
                phone: result.phone,
                user_type: result.user_type,
                token: generatedToken.token,
                refresh_token: refreshToken,
                access_codes: result.access_codes
            };

            return res.sendSuccess(data);
        } catch (e) {
            return res.sendError('-1', req.header('languageId'));
        }
    }

    static async signinByToken(req, res) {
        try {
            const user = await userHelper.getUserByToken(req.params.token);
            if (!user) {
                throw USER_NOT_FOUND;
            }
            const result = {
                uid: user.uid,
                email: user.email,
                username: user.username,
                phone: user.phone,
                user_type: user.user_type,
                token: user.tokens[0]['token'],
                access_codes: user.access_codes
            };
            res.sendSuccess(result);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
        }
    }

 
    static async signup(req, res) {
        try {
            const options = {
                user: req.body,
                clientKey: req.client.key,
                platform: req.header('Platform'),
                app_version: req.header('App-Version')
            };

            const result = await AuthHelper.signup(options);
            res.sendSuccess(result);
        } catch (error) {
            // @TODO log error
            console.log(error);
            return res.sendError(error, req.header('languageId'), '', error);
        }
    }

    static async forgotPassword(req, res) {
        try {
            // check if user exists with email
            const user = await userHelper.getByEmail(
                req.body.email.toLowerCase()
            );

            if (!user) {
                return res.json(new response('0000', null, null));
            }

            const reset_password_token = crypto.randomBytes(20).toString('hex');
            const reset_password_token_expire_at = new Date(
                Date.now() + 1000 * 60 * 60 * 24
            ); // 1 day

            // set token in database
            await userHelper.update(user.uid, {
                reset_password_token,
                reset_password_token_expire_at
            });

            const resetURL = `https://www.handyman.com/auth/resetPassword/${reset_password_token}`;

            const email = new Email();
            await email.send({
                message: email.generateForgotPasswordMessage({
                    user,
                    resetURL
                }),
                subject: 'Reset Password For Your Handyman Account',
                to: user.email
            });

            return res.sendSuccess(`Email sent successfully`);
        } catch (error) {
            console.log(error);
            return res.json(new response('-1', error.message, null));
        }
    }

    static async resetPassword(req, res) {
        try {
            if (req.body.password !== req.body.confirm_password) {
                throw Error('1004');
            }

            const user = await userHelper.getByResetPasswordToken(
                req.params.token
            );

            if (!user) {
                throw Error('1003');
            }
            // hash new password
            const password = await userHelper.hashPassword(
                req.body.password.trim()
            );

            await userHelper.update(user.uid, {
                password
            });

            return res.json(
                new response('0000', 'Password was reset successfully', null)
            );
        } catch (error) {
            console.log(error);
            return res.sendError(error.message, req.header('languageId'));
        }
    }

    static async refreshToken(req, res) {
        const token = req.body.token;
        const refreshToken = req.body.refresh_token;
        const user = await userHelper.getUserByToken(token);
        try {
            await TokenHelper.verify(refreshToken);

            return res.sendSuccess();
        } catch (error) {
            console.log(error);
            switch (error) {
                case '0010':
                    const result = await TokenHelper.generate(user);
                    return res.sendSuccess({
                        token: result.generatedToken.token,
                        refresh_token: result.refreshToken
                    });

                default:
                    return res.sendError(error, req.header('languageId'));
            }
        }
    }
}

module.exports = Auth; 
