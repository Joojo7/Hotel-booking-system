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
            const givenClientKey = req.header('Client-key');

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
                primary_address: {
                    address: user.location.address,
                    street: '', // deprecated
                    city: '', // deprecated
                    state: user.location.state,
                    postal_code: user.location.postcode
                },
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


  
  
}

module.exports = UserController;
