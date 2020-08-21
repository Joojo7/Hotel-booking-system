const register = {
    uid: {
        in: ['params'],
        exists: true
    },
    token: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    deviceId: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    }
};

const create = {
    to: {
        in: ['body'],
    },
    title: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    body: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    }
};

module.exports = { register, create };
