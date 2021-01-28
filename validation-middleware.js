'use strict';

const validator = require('../helpers/validate');
const httpHelper = require('../helpers/http');
const constants = require('../helpers/constants');
const code = constants.HTTP_CODES;
const Validator = require('validatorjs');
require('../helpers/custom_validation');


const NoWhiteSpaceRegex = /^\S*$/;
// Tighten no whitespaces policy
Validator.register('NoWhiteSpace', value => NoWhiteSpaceRegex.test(value),
    'No spaces are allowed');

const socialLogin = (req, res, next) => {
    const validationRuleProfile = {
        'email': 'string|email|NoWhiteSpace',
        'social_id': 'required|string|NoWhiteSpace',
        'social_type': 'required|string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.msg, response.error);
        } else {
            next();
        }
    });
};

const login = (req, res, next) => {
    const validationRuleProfile = {
        'email': 'required|string|email|NoWhiteSpace',
        'password': 'required|string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.msg, response.error);
        } else {
            next();
        }
    });
};

const verifyOTPEmail = (req, res, next) => {
    const validationRuleProfile = {
        'email': 'required|string|email|NoWhiteSpace',
        'otp_email': 'required|numeric|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.msg, response.error);
        } else {
            next();
        }
    });
};


const verifyOTPPhone = (req, res, next) => {
    const validationRuleProfile = {
        'phone': 'required|numeric|NoWhiteSpace',
        'country_code': 'required|string|NoWhiteSpace',
        'otp': 'required|numeric|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.msg, response.error);
        } else {
            next();
        }
    });
};

const loginEmail = (req, res, next) => {
    const validationRuleProfile = {
        'email': 'required|string|email|NoWhiteSpace'
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.msg, response.error);
        } else {
            next();
        }
    });
};


const loginPhone = (req, res, next) => {
    const validationRuleProfile = {
        'phone': 'required|numeric|NoWhiteSpace',
        'country_code': 'required|string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation falied'};
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};

const forgotPassword = (req, res, next) => {
    const validationRuleProfile = {
        'email': 'required|string|email|NoWhiteSpace'
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};

const verifyOtpToken = (req, res, next) => {
    const validationRuleProfile = {
        'otp': 'required|numeric|NoWhiteSpace'
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};


const updateMenu = (req, res, next) => {
    const validationRuleProfile = {
        'status': 'required|string|NoWhiteSpace',
        'id': 'required|numeric|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed'};
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};

const setPassword = (req, res, next) => {
    const validationRuleProfile = {
        'password': 'required|string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};

const notificationEnabled = (req, res, next) => {
    const validationRuleProfile = {
        'notification_type': 'required|string|NoWhiteSpace',
        'notification_token': 'string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};
const changePassword = (req, res, next) => {
    const validationRuleProfile = {
        'new_password': 'required|string|NoWhiteSpace',
        'old_password': 'required|string|NoWhiteSpace',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};

const addMenu = (req, res, next) => {
    const validationRuleProfile = {
        'name': 'required|string',
        'price': 'required|string',
        'description': 'required|string',
    };
    // console.log(req);
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};
const editMenu = (req, res, next) => {
    const validationRuleProfile = {
        'name': 'required|string',
        'price': 'required|string',
        'description': 'required|string',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};
const updateProfile = (req, res, next) => {
    const validationRuleProfile = {
        'full_name': 'required|string',
    };
    validator(req.body, validationRuleProfile, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};


const signup = (req, res, next) => {
    const validRules = {
        'rname':'required|string',
        'locations':'required|string',
        'fname':'required|string',
        'lname':'required|string',
        'role':'required|string',
        'phone':'required|string',
        'email':'required|string',
    };
    reqValidator(req.body, validRules, res, next);
};

const resend = (req, res, next) => {
    const validRules = {
        'email':'required|email',
    };
    reqValidator(req.body, validRules, res, next);
};


const chefAddress = (req, res, next) => {
    const validRulesPrimary = {
        'type':'required|string',
        'street':'required|string',
        'city':'required|string',
        'zip':'required|string|validzip|NoWhiteSpace',
        'country':'required|string',
    };
    if(req.params.type === 'primary'){
        reqValidator(req.body, validRulesPrimary, res, next);
    } else {
        throw new Error ('Only primary address allowed');
    }
};

// const signupMenu = (req, res, next) => {
//     const valObj = {
//         'link': 'required|link'
//     }
//     reqValidator(req.body, valObj, res, next);
// }


const reqValidator = (reqBody, validRules, res, next) => {
    validator(reqBody, validRules, {}, (err, status) => {
        if (!status) {
            let response = {};
            const errors = Object.values(err.errors);
            const errMsg = errors[0][0].toString();
            response = { status: code.STATUS412, msg: errMsg, error: 'Validation failed' };
            httpHelper.sendCustomErrorValid(res, response.status, response.msg, response.error);
        } else {
            next();
        }
    });
};



module.exports = {
    login,
    updateMenu,
    changePassword,
    setPassword,
    forgotPassword,
    verifyOtpToken,
    notificationEnabled,
    addMenu,
    editMenu,
    socialLogin,
    loginEmail,
    loginPhone,
    verifyOTPPhone,
    verifyOTPEmail,
    updateProfile,
    signup,
    resend,
    chefAddress
};
