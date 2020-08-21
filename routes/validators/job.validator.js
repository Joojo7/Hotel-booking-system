const create = {
    title: {
        in: ['body'],
        isString: true,
    },
    image_url_web: {
        in: ['body'],
        isString: true,
    },
    category: {
        in: ['body'],
        isString: true,
    },
    type: {
        in: ['body'],
        isString: true,
    },
    'geometry.cordinates.*': {
            in: ['body'],
            isString: true,
    
    },
    description: {
        in: ['body'],
        isString: true
    },
    start_date: {
        in: ['body'],
        isString: true
    },
    end_date: {
        in: ['body'],
        isString: true
    },
    is_approved: {
        in: ['body'],
        isBoolean: true
    },
    publish_expiry_date: {
        in: ['body'],
        isString: true
    },
    terms: {
        in: ['body'],
        isString: true
    },
    status: {
        in: ['body'],
        isInt: true,
    }
    
};




module.exports = { create };
