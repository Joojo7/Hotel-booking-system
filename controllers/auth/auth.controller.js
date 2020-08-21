// Packages
const token = require('../../helpers/token.helper');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const validator = require('validator');
const {
    BARCODE_EXSIST,
    EMAIL_PHONE_EXSIST,
    USER_NOT_FOUND,
    USERNAME_LENGTH_SMALL
} = require('../../errorDefinition/errors.map');

// Helpers
const userHelper = require('../../helpers/user.helper');

const response = require('../../helpers/response.helper');
const isEmpty = require('lodash/isEmpty');
const TokenHelper = require('../../helpers/token.helper');
const AuthHelper = require('../../helpers/auth.helper');

class Auth {
    /**
     * @api {post} /user/signin Create a new user
     * @apiName signin
     * @apiGroup user
     *
     * @apiParam {String} email_phone  user email or user phone number.
     * @apiParam {String} user password.
     */
    static async signin(req, res) {
        console.log('req:', req.body)
        
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
                return res
                    .status(401)
                    .json(
                        new response('0015', 'Email/Phone is not valid', null)
                    );
            }
        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json(new response('-1', 'UNEXPECTED_ERROR', null));
        }

        if (!result) {
            return res
                .status(203)
                .json(
                    new response('0017', 'wrong email/phone or password', null)
                );
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
                country_code: result.country_code,
                phone: result.phone,
                user_type: result.user_type,
                token: generatedToken.token,
                refresh_token: refreshToken,
                access_codes: result.access_codes
            };

            return res
                .status(200)
                .json(new response('0000', 'SUCCESSFUL', data));
        } catch (e) {
            return res
                .status(500)
                .json(new response('-1', 'UNEXPECTED_ERROR', null));
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
                country_code: user.country_code,
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

    /**
     * @api {post} /user/signup Create a new user
     * @apiName signup
     * @apiGroup user
     *
     * @apiParam {String} username  full name of user
     * @apiParam {String} email  email address
     * @apiParam {String} country_code  country code, example "MY".
     * @apiParam {String} password  user chosen password more than 6 charecters "MY".
     * @apiParam {Number} account_type  0 if individual or 1 if expert.
     */
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
