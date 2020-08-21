class Response {
    constructor({
        code,
        message,
        data,
        total_count,
        action,
        devError
    }) {
        this.code = code;
        this.message = message;
        this.data = data;

        this.total_count = total_count;

        this.action = action;
        this.devError = devError;
    }
}

module.exports = Response