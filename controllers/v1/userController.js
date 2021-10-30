const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const User = require('./../../models/user.model');

require('./../../misc/response_codes');

const reqBody = {
    username: '',
    // first_name: '',
    // last_name: '',
    _role_id: '',
    email: '',
    password: '',
};

const optBody = {
    _username: '',
    // _first_name: '',
    // _last_name: '',
    _role_id: '',
    _email: '',
    _password: ''
};



const index = (req, res, next) => {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
    const {
        username,
        first_name,
        last_name,
        search,
        sort_desc,
        sort_id,
        role
    } = req.query;

    let where = ` WHERE user.deleted IS null  `;

    if (sort_id) {
        where += `
            ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
        `;
    }

    if (search) {
        where += `
            AND first_name LIKE '%${search}%' \
            OR last_name LIKE '%${search}%' \
            OR username LIKE '%${search}%' \
        `;
    }

    if (role) {
        where += `
            AND role.name = '${role}'
        `;
    }

    let count = 0;

    User.count({
        where,
        offset,
        result: (err, data) => {
            count = data;
        }
    });

    User.index({
        where,
        offset,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_FETCH,
                context: err
            }, 500);

            Global.success(res, {
                data,
                count,
                page,
                limit,
                message: data.length ? 'Sucessfully retrieved users' : NO_RESULTS
            }, data.length ? 200 : 404);
        }
    });
}

const show = (req, res, next) => {
    let id = req.params.id;

    User.show({
        id,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_FETCH
            }, 500);

            else Global.success(res, {
                data,
                message: data ? 'Sucessfully retrieved users' : NO_RESULTS
            }, data ? 200 : 404);
        }
    });
}

const store = (req, res, next) => {
    const data =
        util._get
            .form_data(reqBody)
            .from(req.body);

    if (data instanceof Error) {
        Global.fail(res, {
            message: INV_INPUT,
            context: INV_INPUT
        }, 500);
    }

    data.id = uuidv4();
    data.created = new Date();

    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(data.password, salt, (fail, hash) => {
            data.password = hash;


            if (fail) {
                Global.fail(res, {
                    message: FAILED_TO_CREATE,
                    context: fail
                }, 500);
            }

            User.store({
                body: data,
                result: (err, data) => {
                    if (err) Global.fail(res, {
                        message: FAILED_TO_CREATE
                    }, 500);

                    else Global.success(res, {
                        data,
                        message: data ? 'Sucessfully created user' : FAILED_TO_CREATE
                    }, data ? 200 : 400);
                }
            })

        });
    });
}

const update = (req, res, next) => {
    const data =
        util._get
            .form_data(optBody)
            .from(req.body);

    if (data instanceof Error) {
        Global.fail(res, {
            message: INV_INPUT,
            context: INV_INPUT
        }, 500);
    }

    const id = req.params.id;

    data.updated = new Date();

    if (data.password) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(data.password, salt, (fail, hash) => {
                data.password = hash;

                if (fail) {
                    Global.fail(res, {
                        message: FAILED_TO_UPDATE,
                        context: fail
                    }, 500);
                }

                User.update({
                    id,
                    body: data,
                    result: (err, data) => {
                        if (err) Global.fail(res, {
                            message: FAILED_TO_UPDATE,
                            context: err
                        }, 500);

                        else Global.success(res, {
                            data,
                            message: data ? 'Sucessfully created user' : FAILED_TO_CREATE
                        }, 200);
                    }
                })

            });
        });
    }


    User.update({
        id,
        body: data,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_TO_UPDATE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully updated user'
            }, 200);
        }
    })


}

const remove = (req, res, next) => {
    let id = req.params.id;

    User.delete({
        id,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_TO_DELETE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully deleted user'
            }, 200)
        }
    });
}



module.exports = {
    index,
    show,
    store,
    update,
    remove
}