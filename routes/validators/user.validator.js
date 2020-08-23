const update = {
    email: {
        in: ['body'],
        isString: true
    },
    phone: {
        in: ['body'],
        isString: true
    },
    referral: {
        in: ['body'],
        isString: true
    },
    location: {
        in: ['body'],
        isString: true
    },
    ic_number: {
        in: ['body'],
        isString: true
    },
    gender: {
        in: ['body'],
        isString: true
    },
    avatar: {
        in: ['body'],
        isString: true
    },
    extra_access_codes: {
        in: ['body'],
        isString: true
    },
    newPassword: {
        in: ['body'],
        isString: true
    },
    oldPassword: {
        in: ['body'],
        isString: true
    },
    confirmPassword: {
        in: ['body'],
        isString: true
    }
};


module.exports = { update };
