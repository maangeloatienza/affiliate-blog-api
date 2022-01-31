const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Access = require('./../../models/accessControlList.model');

require('./../../misc/response_codes');

const reqBody = {
  _isRead: true,
  _isWrite: false,
  _isRemove: false,
  api_group: '',
  role_id: ''
}

const index = (req, res, next) => {
  const {
    api_group
  } = req.query;

  let where = ` WHERE access.deleted is NULL `;

  if (api_group) {
    where += `
      access.api_group = '${api_group}'
    `
  }

  Access.index({
    where,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH,
        context: err
      }, 500);
      console.log(data)
      Global.success(res, {
        data,
        message: data.length ? 'Successfully retrieved access control list' : NO_RESULTS
      }, data.length ? 200 : 404)
    }
  })

}

const show = (req, res, next) => {
  const {
    id,
    api_group
  } = req.query;

  let where = ` WHERE access.deleted is NULL `;

  if (api_group) {
    where += `
      access.api_group = '${api_group}'
    `
  }

  Access.show({
    id,
    where,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH,
        context: err
      }, 500);

      Global.success(res, {
        data,
        message: data.length ? 'Successfully retrieved access control list' : NO_RESULTS
      }, data.length ? 200 : 204)
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

  Access.store({
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_CREATE,
        context: err
      }, 500);

      Global.success(res, {
        data,
        message: 'Successfully created access control list'
      }, 200)
    }
  })

}

module.exports = {
  index,
  show,
  store
}