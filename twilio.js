'use strict';

const utils = require('../utils');

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, msg) => {
    try {
        if ((process.env.NODE_ENV === 'production') || (process.env.SENDSMS)) {
            await client.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
                body: msg
            }).then((message) => {
                return message.sid;
            }).catch((message1) => { return message1;});
        }
    } catch (error) {
        throw new Error(error);
    };
};

exports.sendOTP = async (country_code, phone, otp) => {
    try {
        const phoneNumber = utils.getPhone(country_code, phone);
        const message = `<#> ${otp} is the otp for registering with ayalyfe.`;
        const result = await sendSMS(phoneNumber, message);
        return result;
    } catch (error) {
        throw new Error(error);
    };
};


