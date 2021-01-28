'use strict';

var jwt = require('jsonwebtoken');
const constant = require('../helpers/constants');
const code = constant.RESPONSE_STATUS_CODES;
const userService = require('../services/user');
const chefService = require('../services/chef/chef');
const ten = 10;

//User Authentication Validator.
const validateToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
        if (token) {
            const decoded = await verifyJWT(token);
            req.decoded = decoded;
            const result = await userService.getUserDetailByCond({ id: decoded.id, user_token: token });
            if (result.length > 0) {
                req.userData = result[0];
                next();
            } else {
                res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized ,Invalid token' });
            }

        } else {
            res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized, Invalid token' });
        }
    } catch (error) {
        res.status(code.STATUS401).send({ status: code.STATUS401, msg: error.toString() });
    }
};

//Chef Authentication Validator.
const validateChefToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers.authorization || req.body.authorization; // Express headers are auto converted to lowercase
        if (token) {
            const decoded = await verifyJWT(token);
            req.decoded = decoded;
            const result = await chefService.getUserDetailByCond({ id: decoded.id, chef_token: token });
            if (result.length > 0) {
                req.userData = result[0];
                next();
            } else {
                res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized ,Invalid token' });
            }

        } else {
            res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized, Invalid token' });
        }
    } catch (error) {
        res.status(code.STATUS401).send({ status: code.STATUS401, msg: error.toString() });
    }
};

const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers.authorization || req.body.authorization; // Express headers are auto converted to lowercase
        if (token) {
            const decoded = await verifyJWT(token);
            req.decoded = decoded;
            const result = await chefService.getAdminDetailByCond({ id: decoded.id, chef_token: token });
            if (result && result.length > 0) {
                req.userData = result[0];
                next();
            } else {
                res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized ,Invalid token' });
            }
        } else {
            res.status(code.STATUS401).send({ status: code.STATUS401, msg: 'Unauthorized, Invalid token' });
        }
    } catch (error) {
        res.status(code.STATUS401).send({ status: code.STATUS401, msg: error.toString() });
    }
};


var verifyJWT = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    verifyToken: validateToken,
    verifyChefToken: validateChefToken,
    verifyAdminToken
};
