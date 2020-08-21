const demerit = {
    email: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    rp: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    item: {
        in: ['body'],
        isString: true,
    }
};
module.exports = { demerit };