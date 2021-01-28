'use strict';

const constants = require('../helpers/constants');
const code = constants.RESPONSE_STATUS_CODES;
const userService = require('../services/user');
const httpHelper = require('../helpers/http');
const bcrypt = require('../helpers/bcrypt');
const awsSdk = require('../helpers/aws_sdk');
const parse = require('url-parse');
const passwordCharSize = 6;
const passwordCheckRegex = /^[A-Za-z0-9_@./#&+-]*$/;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//get Profile details of the user
exports.getProfile = async (req, res) => {
    try {
        var responseRequest = req.userData;
        if (responseRequest.id) {
            const dataP = await userService.getUserDetailByCond(
                { 'id': responseRequest.id },
                ['full_name', 'country_code', 'phone', 'email', 'profile_image_path']);
            if (dataP.length == 0) {
                res.status(code.STATUS200).send({ status: code.STATUS200, msg: 'No data found', data: {} });
            } else {
                var profileData = dataP[0];
                res.status(code.STATUS200).send({ status: code.STATUS200, msg: 'User profile fetched succesfully', data: profileData });
            }
        } else {
            res.status(code.STATUS412).send({ status: code.STATUS412, msg: 'User id doesnot exists', data: {} });
        }
    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};


//update Profile details of the user
exports.updateProfile = async (req, res) => {
    try {
        const body = req.body;
        const user = req.userData;
        let response = {};
        if (body && req.profile_image_path) {
            var dataP = [];
            if (body.email && body.email != '') {
                dataP = await userService.getUserDetailByCond({ id: { [Op.notIn]: [user.id] }, email: body.email }, ['full_name', 'country_code', 'phone', 'email', 'profile_image_path']);
            }
            if (dataP.length == 0) {
                const profile_image_path = req.profile_image_path;
                const {full_name, email, phone } = body;
                const userData = {full_name, email, phone, profile_image_path};
                userService.updateUserData(userData, {
                    where: { 'id': user.id }
                });
                response = { status: code.STATUS200, msg: 'User setting updated successfully' };
            } else {
                response = { status: code.STATUS422, msg: 'User email already exist with another account' };
            }
        } else {
            response = { status: code.STATUS422, msg: 'Please enter name, email and upload profile' };
        }
        httpHelper.sendCustomSuccess(res, response.status, response.msg, response.data);
    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};

//update FCM token details of the user
exports.updateNotificationToken = async (req, res) => {
    try {
        const body = req.body;
        const user = req.userData;
        let response = {};
        if (body.notification_token) {
            var settingArr = {};
            settingArr.notification_token = body.notification_token;

            if (settingArr) {
                await userService.updateUserData(settingArr, {
                    where: { 'id': user.id }
                }).then(r => {
                    response = { status: code.STATUS200, msg: 'User setting updated successfully' };
                }).catch(e => {
                    response = { status: code.STATUS200, msg: e.toString() };
                });
            }
        } else {
            response = { status: code.STATUS422, msg: 'You need to send valid parameter for update' };
        }
        httpHelper.sendCustomSuccess(res, response.status, response.msg, response.data);
    } catch (error) {
        res.status(code.STATUS500).send({ status: code.STATUS500, msg: error.toString() });
    }
};

//Change password  details of the user
exports.changePassword = async (req, res) => {
    try {
        const user = req.userData;
        const oldPass = req.body.old_password;
        const newPass = req.body.new_password;
        const verifyPass = await bcrypt.checkPassword(oldPass, user.password);
        let response = {};
        if (verifyPass) {
            if (newPass && newPass.length >= passwordCharSize && passwordCheckRegex.test(newPass)) {
                const encodedPass = await bcrypt.getHash(newPass);
                userService.upsertUserPass(user.id, encodedPass);
                response = { status: code.STATUS200, msg: 'User password changed successfully' };
            } else {
                response = { status: code.STATUS422, msg: 'Correct password must be Required' };
            }
            res.status(response.status).send(response);
        } else {
            res.status(code.STATUS403).send({ status: code.STATUS403, msg: 'Old password is not correct' });
        }
    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};


exports.logout = async (req, res) => {
    try {
        const user = req.userData;
        var response = {};
        const condition = { where: { id: user.id } };
        if (user) {
            await userService.updateUserData({ user_token: null }, condition);
            response = { status: code.STATUS200, msg: 'User logout successfully' };
            res.status(response.status).send(response);
        }
    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};

exports.sendMessage = async (req, res) => {
    try {
        // console.log(await twiloHelper.sendOTP('+91', '7087382791', '2345'));
        // console.log('sdsa');


    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};
