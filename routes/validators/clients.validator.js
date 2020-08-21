const create = {
    merchant: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    address: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    number_of_bins: {
        in: ['body']
    },
    contract_date: {
        in: ['body']
    },
    contract_period: {
        in: ['body']
    },
    business_type: {
        in: ['body']
    }
};

const update = {};

module.exports = { create, update };
