// Helpers
const userHelper = require('../../helpers/user.helper');
const response = require('../../helpers/response.helper');
const pick = require('lodash/pick');
const token = require('../../helpers/token.helper');
const crypto = require('crypto');
const isEmpty = require('lodash/isEmpty');
// Other internal files
const {
    EMAIL_TAKEN,
    PHONE_TAKEN,
    USER_NOT_FOUND
} = require('../../errorDefinition/errors.map');

class UserController {
    /**
     * @api {get} /user/profile  Get user profile information.
     */
    static async profile(req, res) {
        try {
            const user = await userHelper.findById(req.user._id);
            // const barcodes = await userHelper.findBarcodes(req.user._id);
            // let balanced_rp = 0;
            // let accumulatedCO2 = 0;
            // let co2e = "0";
            // let busCo2Saved = 0;
            const givenClientKey = req.header('Client-key');

            // if (req.user.uid) {
            //     balanced_rp = await pointSummaryHelper.getBalancedRP(
            //         req.user.uid
            //     );
                
            //     // @TODO: merge this call with balanced rp at the same query.
            //     accumulatedCO2 = await pointSummaryHelper.getCO2(req.user.uid);
            // }



            // const barcodesResult = barcodes ? barcodes : [];

            // const stringOfBarcodes = barcodesResult.map(barcode => {
            //     return barcode.barcode;
            // });

            if (!user) {
                throw USER_NOT_FOUND
            }

            let profile = {
                uid: user.uid,
                email: user.email,
                username: user.username,
                country_code: user.country_code,
                phone: user.phone,
                gender: user.gender,
                is_email_verified: user.is_email_verified,
                ic_number: user.ic_number,
                user_type: user.user_type,
                avatar: user.avatar,
                rate: user.rate,
                // referral: user.referral ? user.referral : '',
                // last_update: user.last_update,
                // barcodes: barcodesResult ? stringOfBarcodes : [],
                // balanced_rp: balanced_rp.toString(), // fixme: change to number
                primary_address: {
                    address: user.location.address,
                    street: '', // deprecated
                    city: '', // deprecated
                    state: user.location.state,
                    postal_code: user.location.postcode
                },
                // accumulated_CO2: (accumulatedCO2).toString(),
                // bird_count: user.birds.length
            };


            return  res.sendSuccess(profile);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), null, error);
        }
    }

    static async index(req, res) {
        try {
            const options = {
                page: req.query.page,
                filter: req.query.filter,
                order: req.query.order,
                pageSize: req.query.pageSize,
                sort: req.query.sort,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate,
            };

            const users = await userHelper.getUsers(options);

            res.sendSuccess(users);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
        }
    }

    /**
     * @api {patch} /user/  Update user profile
     * @apiName update
     * @apiGroup user
     *
     * @apiParam {Object} to_update  user email or user phone number.
     */
    static async update(req, res) {
        try {
            const user = req.body;
            const uid = req.params.uid;

            if (user.email) {
                const userExistsByEmail = await userHelper.getUserIfExist({
                    email: user.email.trim().toLowerCase()
                });
                if (userExistsByEmail) {
                    if (userExistsByEmail.uid != uid) {
                        throw EMAIL_TAKEN;
                    }
                }
            }

            if (user.phone) {
                const userExistsByPhone = await userHelper.getUserIfExist({
                    phone: user.phone.trim()
                });
                if (userExistsByPhone) {
                    if (userExistsByPhone.uid != uid) {
                        throw PHONE_TAKEN;
                    }
                }
            }

            const fieldsToUpdate = pick(user, [
                'email',
                'phone',
                'country_code',
                'username',
                'referral',
                'location',
                'ic_number',
                'gender',
                'avatar',
                'extra_access_codes',
                'new_password',
                'old_password',
                'confirm_password',
                'rate'
            ]);

            if (isEmpty(fieldsToUpdate)) {
                throw {
                    message: 'No field specified to be updated!'
                };
            }

            const result = await userHelper.update(uid, fieldsToUpdate);

            return res.sendSuccess();
        } catch (error) {
            console.log(error);
            return res.sendError(error, req.header('languageId'));
        }
    }

    static async removeAccessCodeFromUser(req, res) {
        try {
            const access_code = req.body.access_code;

            if (!access_code) {
                throw Error('0005');
            }

            const result = await userHelper.removeAccessCode(
                req.params.id,
                access_code
            );

            if (result.n < 1) {
                throw Error('1009');
            }

            return res.sendSuccess(`${access_code} removed successfully`);
        } catch (error) {
            return res.sendError(error.message, req.header('languageId'));
        }
    }

    static async getUserAccessCodes(req, res) {
        try {
            const result = await userHelper.getUserAccessCodes(req.params.id);

            return res.sendSuccess(result);
        } catch (error) {
            console.log(error);

            return res.sendError(error.message, req.header('languageId'));
        }
    }

    static async getUserBirdCollection(req, res) {
        try {
            const result = await userHelper.getUserListOfBirds(req.params.id);

            return res.sendSuccess(result);
        } catch (error) {
            console.log(error);

            return res.sendError(error.message, req.header('languageId'));
        }
    }

    static async getAllCollectors(req, res) {
        try {
            const options = {
                sort: req.query.sort,
                order: req.query.order,
                filter: req.query.filter,
                page: req.query.page,
                recordPerPage: req.query.pageSize
            };

            const result  = await userHelper.getAllCollectors(options);
          
            
            return res.sendSuccess(result);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), '', error);
        }
    }

    static async getAllUser(req, res) {
        try {
            let query = req.params.regex;

            if (query == undefined) {
                query = 'a';
            }

            const allUsers = await userHelper.getAllUsersFilter(query);

            if (allUsers.length == 0) {
                return res.json(new response('8456', 'No data', null));
            }

            return res.json(
                new response('0000', 'SUCCESSFULL', allUsers, allUsers.length)
            );
        } catch (error) {
            return res.json(new response('-1', 'UNEXPECTED ERROR', null));
        }
    }


    static async getUserInfos(req, res) {
        try {
            const users = req.query.users
            const userArray = users.split(',');

            const UserInfo = await userHelper.getUserInfos(userArray);

            res.sendSuccess(UserInfo);
        } catch (error) {
            console.log(error)
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async getAllBarcodes(req, res) {
        try {
            let query = req.params.regex;

            if (query == undefined) {
                query = 'a';
            }

            const user = await userHelper.getAllBarcodes(query);

            if (allUsers.length == 0) {
                return res.json(new response('8456', 'No data', null));
            }

            return res.json(
                new response('0000', 'SUCCESSFULL', user, user.length)
            );
        } catch (error) {
            return res.json(new response('-1', 'UNEXPECTED ERROR', null));
        }
    }

    /**
     * @api {get} /user/barcodes  Get user barcodes.
     */
    static async getAllBarcodes(req, res) {
        try {
            let uid = req.params.regex;

            let user = await userHelper.findByUid(uid);

            const barcodes = await userHelper.findBarcodes(user._id);
            return res.status(200).json(new response('0017', 'SU', barcodes));
        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json(new response('-1', 'UNEXPECTED_ERROR', null));
        }
    }

    /**
     * @api {get} /user/:id  Get specific user .
     */
    static async show(req, res) {
        try {
            let uid = req.params.id;
            const user = await userHelper.findByUid(uid);

            if (!user) {
                throw USER_NOT_FOUND;
            }

            return res.sendSuccess(user);
        } catch (error) {
            console.log(error);
            return res.sendError(error, req.header('languageId'));
        }
    }

    static async getBarcode(req, res) {
        const barcode = req.params.barcode.trim().toUpperCase();

        // return res.json({ barcode });

        let result = await userHelper.findByBarcode(barcode);
        if (isEmpty(result)) {
            return res.sendError('4003', req.header('languageId'));
        }

        let data = {
            uid: result.user.uid,
            username: result.user.username
        };

        return res.sendSuccess(data);
    }

    static async sendActiviationEmail(req, res) {
        try {
            const user_email = req.body.email.trim();

            // email_validation_token = unique id (token)
            const email_validation_token = await crypto
                .randomBytes(20)
                .toString('hex');

            console.log('value', email_validation_token);
            //    const reset_password_token_expire_at = new Date(
            //       Date.now() + 3600000
            //     ); // 1 hour

            // set token in database
            const result = await userHelper.updateUserByEmail(user_email, {
                email_validation_token: email_validation_token
            });

            if (result.nModified == 0) {
                res.sendError('Email is not registered!');
            }

            // send email to the user with url https://www.phinonic.com/verify/${email_validation_token}
            // const activiation_email_url = `https://www.phinonic.com/activateEmail/${email_validation_token}`;
            const activiation_email_url = `<a href="http://localhost:4200/activateEmail/${email_validation_token}">https://www.phinonic.com/activateEmail/${email_validation_token}</a>`;

            const email = new Email();
            await email.send({
                message: email.generateVerificationEmailMessage(
                    activiation_email_url
                ),
                subject: 'Verify Your Email Address',
                to: user_email
            });

            return res.sendSuccess(
                `Activation URL has been sent successfully to your email.`
            );
        } catch (error) {
            console.log(error);
            return res.json(new response('-1', error.message, null));
        }
    }

    static async activateUserEmail(req, res) {
        const activation_email_token = req.body.email_token.trim();
        try {
            // set is_email_verified to true
            const result = await userHelper.updateUserByActivationEmailToken(
                activation_email_token,
                {
                    is_email_verified: true
                }
            );

            if (result.nModified == 0) {
                return res.json(
                    new response(
                        '0000',
                        'Your email is already activated.',
                        null
                    )
                );
            }

            return res.json(
                new response(
                    '0000',
                    'Thank you for activation your email address.',
                    null
                )
            );
        } catch (error) {
            console.log(error);
            return res.sendError(error.message, req.header('languageId'));
        }
    }
}

module.exports = UserController;
