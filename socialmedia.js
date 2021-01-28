exports.socialLogin = async (req, res) => {
    try {
        const body = req.body;
        let response = {};
        var iscomplete = false;
        if (body) {
            var settingArr = {};
            settingArr.full_name = body.full_name;
            settingArr.phone = body.phone;
            settingArr.country_code = body.countryCode;
            if (body.email) {
                settingArr.email = body.email;
            }

            settingArr.social_type = body.social_type;
            settingArr.social_id = body.social_id;
            settingArr.user_status = 'ALIVE';
            settingArr.profile_image_path = body.profile_image;
            var emailData = [];
            // var isuser = false;

            if (body.email == '' || body.email == null) {
                emailData = await userService.getUserDetailByCond({ 'social_id': body.social_id, 'social_type': body.social_type }, ['id', 'full_name', 'user_status', 'country_code', 'phone', 'email', 'profile_image_path']);
            } else {
                emailData = await userService.getUserDetailByCond({ 'email': body.email }, ['id', 'role_id', 'full_name', 'user_status', 'country_code', 'phone', 'email', 'profile_image_path']);

            }
            if (emailData.length == 0) {
                const users = await userService.getUserDetailByCond({ 'social_id': body.social_id, 'social_type': body.social_type }, ['id', 'full_name', 'user_status', 'country_code', 'phone', 'email', 'profile_image_path']);
                if (users.length == 0) {
                    const roleObj = await roleService.getRolesByCond({ role: 'user' });
                    userService.validateRole(roleObj);
                    settingArr.role_id = roleObj.id;
                    await userService.addUser(settingArr);
                    // isuser = true;

                }
                const user = await userService.getUserDetailByCond({ 'social_id': body.social_id, 'social_type': body.social_type }, ['id', 'role_id', 'full_name', 'user_status', 'country_code', 'phone', 'email', 'profile_image_path']);
                if (user && user.length > 0 && ['PENDING', 'ALIVE'].includes(user[0].user_status)) {
                    var data = user[0];
                    if (data.phone && data.email && data.full_name) {
                        iscomplete = true;
                    }
                    const token = await common.getTokenUser(data.id, data.role_id);
                    if (token) {
                        res.setHeader('token', token);
                        const condition = { where: { id: data.id } };
                        await userService.updateUserData({ user_token: token, user_status: 'ALIVE' }, condition);
                        const dataValue = {
                            userId: user[0].id,
                            isCompleted: iscomplete,
                            auth: token
                            //isUser: isuser,
                        };
                        response = { status: code.STATUS200, msg: 'User logged in successfully', data: dataValue };
                    } else {
                        response = { status: code.STATUS406, msg: 'Invalid request' };
                    }
                } else if (user & user.length > 0 && user.user_status === 'DEAD') {
                    response = { status: code.STATUS401, msg: 'Your Account has been blocked by Admin. Contact Admin for Account activation' };
                } else {
                    response = { status: code.STATUS401, msg: 'User not exists social' };
                }
            } else {

                if (emailData && emailData.length > 0 && ['PENDING', 'ALIVE'].includes(emailData[0].user_status)) {
                    var data1 = emailData[0];

                    const token = await common.getTokenUser(data1.id, data1.role_id);
                    if (token) {
                        res.setHeader('token', token);
                        const condition = { where: { id: data1.id } };
                        await userService.updateUserData({ user_token: token, user_status: 'ALIVE', 'social_id': body.social_id, 'social_type': body.social_type }, condition);
                        if (data1.phone && data1.email && data1.full_name) {
                            iscomplete = true;
                        }
                        const dataValue = {
                            userId: emailData[0].id,
                            auth: token,
                            isCompleted: iscomplete
                            //isUser: isuser,
                        };
                        response = { status: code.STATUS200, msg: 'User loggeddd in successfully', data: dataValue };
                    } else {
                        response = { status: code.STATUS406, msg: 'Invalid request' };
                    }
                } else if (emailData & emailData.length > 0 && emailData.user_status === 'DEAD') {
                    response = { status: code.STATUS401, msg: 'Your Account has been blocked by Admin. Contact Admin for Account activation' };
                } else {
                    response = { status: code.STATUS401, msg: 'User not exists' };
                }
            }

        } else {
            response = { status: code.STATUS422, msg: 'You need to send valid parameter for update' };
        }
        httpHelper.sendCustomSuccess(res, response.status, response.msg, response.data);
    } catch (error) {
        httpHelper.sendCustomError(res, code.STATUS500, error);
    }
};
