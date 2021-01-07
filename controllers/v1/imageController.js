const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Blog = require('./../../models/blog.model');
const Image = require('./../../models/image.model');

let cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name  : process.env.CLOUD_NAME,
  api_key     : process.env.API_KEY,
  api_secret  : process.env.API_SECRET
});

require('dotenv').config();
require('./../../misc/response_codes');

const reqBody = {
  name: '',
  image: '',
  content: '',
  author_id: ''
};

const optBody = {
  _name: ''
};



const index = (req,res,next)=> {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
    const {
        name,
        search,
        sort_desc,
        sort_id
    } = req.query;

    let where = ` WHERE blog.deleted IS null  `;

    if (sort_id) {
        where += `
            ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
        `;
    }

    if (name) {
      where += `
          AND blog.title LIKE '%${search}%' \
          OR  user.first_name LIKE '%${search}%' \
          OR  user.last_name LIKE '%${search}%' \
      `;
  }

    if (search) {
        where += `
            AND blog.title LIKE '%${search}%' \
            OR  user.first_name LIKE '%${search}%' \
            OR  user.last_name LIKE '%${search}%' \
        `;
    }

    
    let count = 0;

    Blog.count({
        where,
        offset,
        result : (err,data) => {
            count = data;
        }
    });

    Blog.index({
        where,
        offset,
        result: (err, data)=> {
            if (err) Global.fail(res, {
                message: FAILED_FETCH,
                context : err
            }, 500);

            Global.success(res, {
                data,
                count,
                page,
                limit,
                message: data.length ? 'Sucessfully retrieved blog posts' : NO_RESULTS
            }, data.length ? 200 : 404);
        }
    });
}

const show = (req, res, next) => {
    let id = req.params.id;
    
    Blog.show({
        id,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_FETCH
            }, 500);

            else Global.success(res, {
                data,
                message: data ? 'Sucessfully retrieved users' : NO_RESULTS
            }, data?200:404);
        }
    });
}

const store = (req,res,next) => {
    const data =
        util._get
            .form_data(reqBody)
            .from(req.body);

    if(data instanceof Error){
        Global.fail(res,{
            message: INV_INPUT,
            context: INV_INPUT
        },500);
    }

    data.id = uuidv4();
    data.created = new Date();

    if(req.file){
      file = req.file.path

      let temp_holder = await cloudinary.uploader.upload(
          file,
          {
              public_id : file,
              tags : 'uploads'
          },
          (error,image)=>{
              if(err){
                  return Global.fail(res,{
                      message : "Error uploading to cloudinary",
                      context : error
                  },500);
              }

              return image;

          }
      );

    data.image =temp_holder? temp_holder.url : null;
    }

    Image.store({
      body: data,
      result: (err, data)=> {
          if (err) Global.fail(res, {
              message: FAILED_TO_CREATE
          }, 500);

          else Global.success(res, {
              data,
              message: data ? 'Sucessfully created user' : FAILED_TO_CREATE
          }, data ? 200 : 400);
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

const remove = (req,res,next) => {
    let id = req.params.id;

    User.delete({
        id,
        result : (err,data)=> {
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