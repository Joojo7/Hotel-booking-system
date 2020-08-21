class Response {
    // todo: cahge to arguments to object
    constructor(code, message, data, total_count = '') {
        this.code = code;
        if (message) {
            this.message = message;
        }
        this.data = data;

        if (total_count) {
            this.total_count = total_count;
        }
    }
}

module.exports = Response;
