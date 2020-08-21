const updateSequanceStatus = {
    status: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: false
            }
        }
    },
};

const create = {
    prefix: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        errorMessage: 'ID is wrong'
    },
    from: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    to: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    digits: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    address: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    postcode: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    country: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    }
};

module.exports = { create, updateSequanceStatus };