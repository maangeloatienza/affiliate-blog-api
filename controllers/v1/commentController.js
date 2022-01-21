const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Comment = require('./../../models/comment.model');

require('./../../misc/response_codes');

const reqBody = {
  content: '',
  user_id: '',
  blog_id: ''
}

const optBody = {
  _content: ''
}

const index = (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;

  const {
    sort_desc,
    sort_id
  } = req.query;


  if (sort_id) {
    where += `
        ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
    `;
  }

  let count = 0;

  Comment.index({
    where,
    offset,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH,
        context: err
      }, 500)

      Comment.count({
        where,
        offset,
        result: (err, total) => {
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



module.exports = {
  index,
  // show,
  // store,
  // update,
  // remove
}