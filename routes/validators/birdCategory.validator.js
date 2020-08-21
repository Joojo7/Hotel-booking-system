const create = {
    category_name: {
        in: ['body'], 
        isString: true,
    },
    'birds.small': {
        in: ['body'],
        isString: true,
    },
    'birds.medium': {
        in: ['body'],
        isString: true,
    },
    'birds.regular': {
        in: ['body'],
        isString: true,
    },
    'birds.large': {
        in: ['body'],
        isString: true,
    },
    'birds.xlarge': {
        in: ['body'],
        isString: true,
    }
    
};

const update = {
    category_name: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'birds.small': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'birds.medium': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'birds.regular': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'birds.large': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    'birds.xlarge': {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    }
};


module.exports = { create, update };
