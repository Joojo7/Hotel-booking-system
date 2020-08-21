const tokenHelper = require('../helpers/token.helper');
const response = require('../helpers/response.helper');

const { UNAUTHORIZED } = require('../errorDefinition/errors.map');
class AuthMiddleware {
    static async authorize(req, res, next) {
        const token = req.headers['x-auth'];

        try {
            const user = await tokenHelper.verify(token);

            if (this) {
                if (this.accessCodes) {
                    const accesses = AuthMiddleware.accessControl(this.accessCodes, user);
    
                    if (!accesses) {
                        throw UNAUTHORIZED;
                    }
    
                    req.accesses = accesses;
                }
            }


            req.user = user;
            global.currentUser = user;
            next();
        } catch (e) {
            console.log(e);
            return res.sendError(e, req.header('languageId'));
        }
    }

    static accessControl(accessCodes, user) {
        // switch to true if one or more access codes found
        let grantAccess = false;
        if (!user.access_codes) {
            throw UNAUTHORIZED;
        }

        const accesses = [];

        for (const user_access_code of user.access_codes) {
            for (const accessCode of accessCodes) {
                if (accessCode == user_access_code) {
                    accesses.push(AuthMiddleware.mapAccessCodeToMeaningfull(accessCode));
                    grantAccess = true;                        
                }
            }
        }

        if (!grantAccess) {
            throw UNAUTHORIZED;
        }
        return accesses;
       
    }

    static mapAccessCodeToMeaningfull(accessCode) {
        if (!accessCode) {
            return;
        }
        switch (accessCode[accessCode.length - 1]) {
            case '0':
                return 'create';
            case '1':
                return 'read';
            case '2':
                return 'update';
            case '3':
                return 'delete';
            case '9':
                return 'admin';
            default:
                return accessCode;
        }
    }
}

module.exports = AuthMiddleware;
