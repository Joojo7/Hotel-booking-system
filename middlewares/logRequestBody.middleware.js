function logRequestBody(req, res, next) {
    if (req.body) {
        console.info('Request Body: ', req.body);
    }
    next();
}

module.exports = logRequestBody;