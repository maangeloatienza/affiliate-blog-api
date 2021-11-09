const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const User = require('./../../models/user.model');
require('./../../misc/response_codes');

const reqBody = {
    username: '',
    password: ''
}

const login = (req, res, next) => {
    const data =
        util._get
            .form_data(reqBody)
            .from(req.body);
    console.log(data)
    if (data instanceof Error) {
        Global.fail(res, {
            message: INV_INPUT,
            context: INV_INPUT
        }, 500);
    }

    let where = `
        WHERE user.username = '${data.username}' 
    `;

    User.index({
        fetchAll: true,
        where,
        result: (err, user) => {

            if (err) Global.fail(res, {
                message: FAILED_FETCH,
                context: err
            }, 500);

            if (!user.length) return Global.fail(res, {
                message: 'Invalid credentials!',
                context: INV_INPUT

            }, 500);

            bcrypt.compare(data.password, user[0].password, (fail, success) => {
                console.log(data.password, user[0].passowrd)

                if (fail) {
                    return Global.fail(res, {
                        message: 'Error validating user',
                        context: fail
                    }, 500);
                }

                if (!success) {
                    return Global.fail(res, {
                        message: INV_CREDS,
                        context: 'Failed to login'
                    }, 500);
                }


                if (success) {
                    const token = jwt.sign({
                        id: user[0].id,
                        first_name: user[0].first_name,
                        last_name: user[0].last_name,
                        username: user[0].username,
                        role: {
                            id: user[0].role_id,
                            name: user[0].role
                        },
                        email: user[0].email,
                        phone_number: user[0].phone_number,
                        role: user[0].role
                    }, 'secret');

                    Global.success(res, {
                        data: {
                            id: user[0].id,
                            first_name: user[0].first_name,
                            last_name: user[0].last_name,
                            username: user[0].username,
                            email: user[0].email,
                            role: {
                                id: user[0].role_id,
                                name: user[0].role
                            },
                            phone_number: user[0].phone_number

                        },
                        token: `Bearer ${token}`,
                        message: 'User logged in successfully',
                        context: 'Successfully logged in'
                    }, 200);
                }


            });


        }
    })
}

module.exports = {
    login
}