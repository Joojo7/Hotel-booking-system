class CodeError extends Error {
    constructor(code = '-1', ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CodeError);
        }

        // Custom debugging information
        this.code = code;
    }
}

module.exports = CodeError;
