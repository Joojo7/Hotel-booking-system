const addMember = {
    members: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isArray: true
    }
};

const create = {
    group_name: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    members: {
        in: ['body'],
        isArray: true,
        isEmpty: {
            negated: true
        }
    },
    is_default: {
        in: ['body'],
        isBoolean: true
    }
};

const removeMembers = {
    members: {
        in: ['body'],
        isArray: true,
        isEmpty: {
            negated: true
        }
    },
};

module.exports = { addMember, create, removeMembers };
