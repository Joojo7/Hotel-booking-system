const create = {
    warehouse_id: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    warehouse_name: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    collection_date: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'bin[0].bin_id': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    item: {
        in: ['body'],
        isArray: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        custom: {
            options: value =>
                value.length && value.every(i => typeof i === 'string')
        }
    },
    weight: {
        in: ['body'],
        isArray: true,
    },
    number_of_items: {
        in: ['body'],
        isArray: true,
    },
    rp: {
        in: ['body'],
        isArray: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        custom: {
            options: value =>
                value.length &&
                value.every(i => typeof i == 'string' || typeof i == 'number')
        }
    },
    co2: {
        in: ['body'],
        isArray: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        custom: {
            options: value =>
                value.length &&
                value.every(i => typeof i == 'string' || typeof i == 'number')
        }
    }
};

module.exports = { create };
