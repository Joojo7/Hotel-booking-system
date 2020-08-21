const create = {
    item_name: {
        in: ['body'],
        isString: true,
    },
    start_date: {
        in: ['body'],
        isString: true,
    },
    expiry_date: {
        in: ['body'],
        isString: true
    },
    item_multiplier: {
        in: ['body'],
        isInt: true,
    },
    category_id: {
        in: ['body'],
        isString: true
    },
    co2_multiplier: {
        in: ['body'],
        isDecimal: true
    },
    status_flag: {
        in: ['body'],
        isString: true
    },
    display: {
        in: ['body'],
        isInt: true
    },
    category_name: {
        in: ['body'],
        isString: true,
    },
    unit: {
        in: ['body'],
        isString: true,
    }
    
};

const update = {
    item_name: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    start_date: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    expiry_date: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    item_multiplier: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isInt: true
    },
    category_id: {
        in: ['body'],
        isString: true
    },
    category_name: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    display: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isInt: true
    },
    status_flag: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    unit: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    co2_multiplier: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isDecimal: true
    }
};


module.exports = { create, update };
