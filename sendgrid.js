'use strict';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('dotenv').config();
const fromEMail = process.env.SENDGRID_EMAIL;

exports.sendOTP = async (to1, subject1, text1, html1) => {
    try {
        const msg = {
            to: to1, // Change to your recipient
            from: fromEMail, // Change to your verified sender
            subject: subject1,
            text: text1,
            html: html1,
        };

        sgMail
            .send(msg)
            .then(() => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    } catch (error) {
        throw new Error(error);
    };
};
