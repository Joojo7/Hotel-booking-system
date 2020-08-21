const Response = require('../classes/response');
const englishMessageConstant = require('../languages/englishMessageConstant.language');

class Error {
    static getError(code, languageId = 1, action, devError = '') {
        
        
        let message;
        try {
            message = this.getLanguageSpecificErrorMessage(code, languageId);
        } catch (e) {
            if (e instanceof LanguageException) {
                languageId = '1';
                // logger wrong language Id
            } else {
                // logger wrong Code passed
            }
        }

        if (!message) {
            code = '-1';
            message = this.getLanguageSpecificErrorMessage(code, languageId);
        }

        if (action) {
            if (typeof action !== 'string') {
                action = JSON.stringify(action);
            }
        }

        if (devError) {
            if (typeof devError !== 'string') {
                devError = JSON.stringify(devError); 
            }
        }

        

        return new Response({
            code,
            message,
            action,
            devError
        });
    }

    // static getErrorWithAction(code, languageId, action) {

    //     languageId = getValidLanguageId(languageId);
    //     let message;
    //     try {
    //         message = messageConstant[code][languageId];
    //     } catch (e) {
    //         // todo LOGGER for exceptions
    //     }

    //     if (!message) {
    //         code = errorConstants.DEFAULT_ERROR_CODE;
    //         message = messageConstant[code][languageId]
    //     }

    //     if (action) {
    //         if (typeof action !== "string") {
    //             action = JSON.stringify(action);
    //         }
    //     }

    //     return new Response(code, message, action);
    // };

    static getLanguageSpecificErrorMessage(code, languageId) {
        switch (languageId) {
            case '1':
                return englishMessageConstant[code];
            case '2':
                return malayMessageConstant[code];
            case '3':
                return chineseMessageConstant[code];
            default:
                throw new LanguageException('language id is invalid');
        }
    }
}

class LanguageException extends Error {
    constructor(message) {
        super(message);
        this.name = 'language';
    }
}

module.exports = Error;
