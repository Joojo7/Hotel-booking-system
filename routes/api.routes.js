// Packages
const express = require('express');
const { check, checkSchema } = require('express-validator/check');

// Internal files
const requestBodyValidator = require('../middlewares/requestBodyValidator.middleware');

// Initialize the main router
const router = express.Router();

// Autharization middleware
const clientKey = require('./../middlewares/clientKey.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Authintication
// #region
const authController = require('../controllers/auth/auth.controller');

router.post(
    '/user/signin',
    clientKey.clientKey,
    [
        check('password')
            .exists()
            .withMessage('`password` is required'),
        check('email_phone')
            .exists()
            .withMessage('`email_phone` is required')
    ],
    requestBodyValidator.check,
    authController.signin
);

router.post(
    '/user/signup',
    clientKey.clientKey,
    [
        check('email')
            .exists()
            .withMessage('`email` is required'),
        check('email')
            .isEmail()
            .withMessage('Invalid email address'),
        check('phone')
            .exists()
            .withMessage('`phone` is required'),
        check('password')
            .isLength({
                min: 8
            })
            .withMessage('`password` should be more than 8 characters'),
        check('password')
            .exists()
            .withMessage('`password` is required'),
        check('user_type')
            .exists()
            .withMessage('`user_type` is required'),
        check('username')
            .exists()
            .withMessage('`username` is required'),
        check('country_code')
            .exists()
            .withMessage('`country_code is required')
    ],
    requestBodyValidator.check,
    authController.signup
);


router.post(
    '/forgotPassword',
    clientKey.clientKey,
    [
        check('email')
            .exists()
            .withMessage('`email` is required'),
        check('email')
            .isEmail()
            .withMessage('Invalid email address')
    ],
    requestBodyValidator.check,
    authController.forgotPassword
);

router.post(
    '/resetPassword/:token',
    clientKey.clientKey,
    [
        check('password')
            .exists()
            .withMessage('`password` is required'),
        check('password')
            .isLength({
                min: 8
            })
            .withMessage('`password` should be more than 8 characters'),
        check('confirm_password')
            .exists()
            .withMessage('`confirm_password` is required')
    ],
    requestBodyValidator.check,
    authController.resetPassword
);

router.get(
    '/users/getByToken/:token',
    clientKey.clientKey,
    authController.signinByToken
);

router.get('/refreshToken', clientKey.clientKey, authController.refreshToken);
// #endregion




// users
// #region
const UsersController = require('../controllers/users/user.controller');
const UsersValidatorSchema = require('./validators/user.validator');
router.get(
    '/users',
    clientKey.clientKey,
    // authMiddleware.authorize.bind({ accessCodes: ['4002', '4009'] }),
    UsersController.index
);


router.get(
    '/user/profile',
    clientKey.clientKey,
    authMiddleware.authorize,
    UsersController.profile
);
router.patch(
    '/users/:uid',
    clientKey.clientKey,
    authMiddleware.authorize,
    checkSchema(UsersValidatorSchema.update),
    UsersController.update
);
router.put(
    '/users/:uid',
    clientKey.clientKey,
    authMiddleware.authorize,
    checkSchema(UsersValidatorSchema.update),
    UsersController.update
);
router.get(
    '/users/getUserInfos',
    clientKey.clientKey,
    authMiddleware.authorize,
    UsersController.getUserInfos
);
router.get(
    '/users/:id',
    clientKey.clientKey,
    UsersController.show
);

// #endregion




// Notes
// #region
const notesController = require('../controllers/notes/notes.controller');

router.post(
    '/notes',
    clientKey.clientKey,
    authMiddleware.authorize,
    requestBodyValidator.check,
    notesController.create
);

router.get(
    '/notes',
    clientKey.clientKey,
    authMiddleware.authorize,
    notesController.index
);

router.patch(
    '/notes/:id',
    clientKey.clientKey,
    authMiddleware.authorize,
    requestBodyValidator.check,
    notesController.update
);

router.get(
    '/notes/:id',
    clientKey.clientKey,
    authMiddleware.authorize,
    notesController.show
);

router.delete(
    '/notes/:id',
    clientKey.clientKey,
    authMiddleware.authorize,
    notesController.delete
);

// #endregion



module.exports = router;
