const response = require('../helpers/response.helper');
const { validationResult } = require('express-validator/check');

class RequestBodyValidatorMiddleware {
    static async check(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            
            return res.sendError('0006', req.header('languageId'), null, errors.array());
        }
        next();
    }
}

module.exports = RequestBodyValidatorMiddleware;
