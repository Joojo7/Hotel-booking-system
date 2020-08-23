const tokenHelper = require('../helpers/token.helper');
const response = require('../helpers/response.helper');

const { UNAUTHORIZED } = require('../errorDefinition/errors.map');
class AuthMiddleware {
    static async authorize(req, res, next) {
        const token = req.headers['x-auth'];

        try {
            let user = null
            

            if (token) {
                user = await tokenHelper.verify(token);
                req.user = user;
            }

            if (req.originalUrl === '/api/v1.0//orders' && !token) {
                user = {}
            }


            if (!user) {
                throw UNAUTHORIZED;
            }


            
            global.currentUser = user;
            next();
        } catch (e) {
            console.log(e);
            return res.sendError(e, req.header('languageId'));
        }
    }

   
}

module.exports = AuthMiddleware;
