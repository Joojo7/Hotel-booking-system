const create = {
    uid: {
        in: ['body'],
        isString: true,
    },
    tasker_id: {
        in: ['body'],
        isString: true,
    },
    'geometry.cordinates.*': {
            in: ['body'],
            isString: true,
    
    }
    
};




module.exports = { create };
