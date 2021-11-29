const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const fs = require('fs');
const AWS = require('aws-sdk');

const Blog = require('./../../models/blog.model');
const Image = require('./../../models/image.model');

require('dotenv').config();
require('./../../misc/response_codes');


const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const reqBody = {
    _name: '',
    _image: ''
};

const optBody = {
    _name: '',
    _image: ''
};



const index = (req, res, next) => {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
    const {
        name,
        search,
        sort_desc,
        sort_id
    } = req.query;

    let where = ` WHERE image.deleted IS null  `;

    if (sort_id) {
        where += `
            ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
        `;
    }

    if (name) {
        where += `
            OR  image.name LIKE '%${search}%' \
        `;
    }

    if (search) {
        where += `
            AND image.name LIKE '%${search}%' \
            OR  image.image LIKE '%${search}%' \
        `;
    }


    let count = 0;

    Image.count({
        where,
        offset,
        result: (err, data) => {
            count = data;
        }
    });

    Image.index({
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
                message: data.length ? 'Sucessfully retrieved images' : NO_RESULTS
            }, data.length ? 200 : 404);
        }
    });
}

const show = (req, res, next) => {
    let id = req.params.id;

    Image.show({
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

const store = async (req, res, next) => {
    const body =
        util._get
            .form_data(reqBody)
            .from(req.body);
    let file = [];
    let uploadData = [];
    let files = req.files;
    let bucket = process.env.AWS_BUCKET_NAME;

    if (body instanceof Error) {
        return Global.fail(res, {
            message: INV_INPUT,
            context: body.message
        }, 500);
    }



    files.map(file => {
        let fileName = `${file.destination}${file.filename}`
        console.log(file)

        if (file.size > (1024 * 1024 * 10)) {
            return Global.fail(res, {
                message: 'File is to large to upload.',
                context: 'FILE TOO LARGE'
            }, 500)
        }
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/pjpeg" ||
            file.mimetype === "image/png") {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    Global.fail(res, {
                        context: err
                    }, 500);
                }

                let params = {
                    Bucket: bucket,
                    Key: file.originalname,
                    Body: data,
                    ContentType: file.mimetype
                };

                let putObjectPromise = s3.upload(params).promise();
                putObjectPromise.then(function (response) {
                    if (response) {
                        uploadData.push({
                            name: file.originalname,
                            // s3Res: data,
                            image: response.Location
                        })
                        body.id = uuidv4();
                        body.created = new Date();
                        body.name = file.originalname
                        body.image = response.Location

                        if (uploadData.length === files.length) {
                            console.log(body)

                            Image.store({
                                body: body,
                                result: (err, data) => {
                                    if (err) Global.fail(res, {
                                        message: FAILED_TO_CREATE
                                    }, 500);

                                    else Global.success(res, {
                                        uploadData,
                                        message: uploadData ? 'Sucessfully created blog' : FAILED_TO_CREATE
                                    }, data ? 200 : 400);
                                }
                            })
                        }
                    }
                }).catch(function (s3Err) {
                    return Global.fail(res, {
                        message: FAILED_TO_CREATE,
                        context: s3Err
                    }, 500);
                });
            })
        } else {
            return Global.fail(res, {
                message: 'File type not supported!',
                context: 'NOT SUPPORTED'
            }, 500)
        }

    })

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