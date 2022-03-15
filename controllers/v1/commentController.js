const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Comment = require('./../../models/comment.model');

require('./../../misc/response_codes');

const reqBody = {
  content: '',
  _user_id: '',
  blog_id: ''
}

const optBody = {
  _content: '',
  _user_id: '',
  _blog_id: ''

}

const index = (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
  const {
    sort_desc,
    sort_id
  } = req.query;

  let where = ` WHERE comment.deleted IS null `;

  if (sort_id) {
    where += `
        ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
    `;
  }

  let count = 0;

  console.log("INDEX COMMENT")
  Comment.index({
    where,
    offset,
    result: (err, data) => {
      console.log(data)
      console.log(err)
      if (err) Global.fail(res, {
        message: FAILED_FETCH,
        context: err
      }, 500)

      Comment.count({
        where,
        offset,
        result: (errCount, total) => {
          count = total;

          Global.success(res, {
            data,
            count,
            page,
            limit,
            message: data.length ? 'Successfully retrieved comments' : NO_RESULTS
          }, data.length ? 200 : 400)
        }
      })
    }
  })
}

const show = (req, res, next) => {
  let id = req.params.id;

  Comment.show({
    id,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH
      }, 500)

      else Global.success(res, {
        data,
        message: data ? 'Sucessfully retrieved comments' : NO_RESULTS
      }, data ? 200 : 404);
    }
  })
}

const store = (req, res, next) => {
  const data =
    util._get
      .form_data(reqBody)
      .from(req.body);

  if (data instanceof Error) {
    return Global.fail(res, {
      message: INV_INPUT,
      context: data.message
    }, 500);
  }

  data.id = uuidv4();
  data.created = new Date();
  data.user_id = req.user.id;

  Comment.store({
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_CREATE
      }, 500);

      else Global.success(res, {
        data,
        message: data ? 'Sucessfully created comment' : FAILED_TO_CREATE
      }, data ? 200 : 400);
    }

  })
}

const update = (req, res, next) => {
  const data =
    util._get
      .form_data(optBody)
      .from(req.body);

  let id = req.params.id;

  if (data instanceof Error) {
    return Global.fail(res, {
      message: INV_INPUT,
      context: data.message
    }, 500);
  }

  data.updated = new Date();

  Comment.update({
    id,
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_UPDATE,
        context: err
      });

      Global.success(res, {
        data,
        message: 'Successfully updated comment'
      }, 200)
    }
  })
}


const remove = (req, res, next) => {
  let id = req.params.id;

  Comment.delete({
    id,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_DELETE,
        context: err
      })

      else Global.success(res, {
        data,
        message: 'Successfully delete comment'
      }, 200)
    }
  })
}



module.exports = {
  index,
  show,
  store,
  update,
  remove
}