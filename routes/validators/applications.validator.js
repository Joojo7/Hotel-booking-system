const create = {
    validation: {
        in: ['body'],
        isBoolean: true,
    },
    applicant_uid: {
        in: ['body'],
        isString: true,
    },
    job_owner: {
        in: ['body'],
        isString: true
    },
    start: {
        in: ['body'],
        isString: true,
    },
    end: {
        in: ['body'],
        isString: true
    },
    'location.address':{
        in: ['body'],
        isString: true
    },
    
};

const update = {
    title: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
    },
    type: {
        in: ['body'],
        isString: true,
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        }
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
    is_approved: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: false
            }
        },
        isBoolean: true
    },
    start_date: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    end_date: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    image_url_web: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    image_url_device: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    image_name: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isString: true
    },
    priority: {
        in: ['body'],
        exists: {
            options: {
                checkNull: true,
                checkFalsy: true
            }
        },
        isInt: true
    },
    terms: {
        in: ['body'],
        isString: true
    },
    url: {
        in: ['body'],
        isString: true
    },
    'location.address': {
        in: ['body'],
            exists: {
                options: {
                    checkNull: true,
                    checkFalsy: true
                }
            },
            isString: true
    },
    system_client: {
        in: ['body'],
        isString: true
    }
};


module.exports = { create, update };
