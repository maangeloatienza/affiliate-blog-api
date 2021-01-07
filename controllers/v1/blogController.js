const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Blog = require('./../../models/blog.model');

require('./../../misc/response_codes');

const reqBody = {
  title: '',
  excerpt : '',
  image: '',
  content: '',
  author_id: ''
};
 
const optBody = {
  _title: '',
  _excerpt : '',
  _image: '',
  _content: '',
  _author_id: ''
};



const index = (req,res,next)=> {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
    const {
        title,
        author,
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
                message: data ? 'Sucessfully retrieved blogs' : NO_RESULTS
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

    Blog.store({
      body: data,
      result: (err, data)=> {
          if (err) Global.fail(res, {
              message: FAILED_TO_CREATE
          }, 500);

          else Global.success(res, {
              data,
              message: data ? 'Sucessfully created blogs' : FAILED_TO_CREATE
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

    Blog.update({
        id,
        body: data,
        result: (err, data) => {
            if (err) Global.fail(res, {
                message: FAILED_TO_UPDATE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully updated blogs'
            }, 200);
        }
    })

    
}

const remove = (req,res,next) => {
    let id = req.params.id;

    Blog.delete({
        id,
        result : (err,data)=> {
            if (err) Global.fail(res, {
                message: FAILED_TO_DELETE,
                context: err
            }, 500);

            else Global.success(res, {
                data,
                message: 'Sucessfully deleted blogs'
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