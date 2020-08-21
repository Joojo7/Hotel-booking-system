const create = {
    bird_name: {
        in: ['body'],
        isString: true,
    },
    bird_image: {
        in: ['body'],
        isString: true,
    },
    caption: {
        in: ['body'],
        isString: true,
    },
    description: {
        in: ['body'],
        isString: true,
    },
    age: {
        in: ['body'],
        isInt: true,
    }
    
};

const update = {
    bird_name: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    bird_image: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    caption: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    description: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    age: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isInt: true
    }
};


module.exports = { create, update };
