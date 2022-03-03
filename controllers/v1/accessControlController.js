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

const optBody = {
  _isRead: true,
  _isWrite: false,
  _isRemove: false,
  _api_group: '',
  _role_id: ''
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
    api_group
  } = req.query;
  const id = req.params.id

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


const update = (req, res, next) => {
  const data =
    util._get
      .form_data(optBody)
      .from(req.body);
  const id = req.params.id;

  if (data instanceof Error) {
    Global.fail(res, {
      message: INV_INPUT,
      context: INV_INPUT
    }, 500);
  }

  data.updated = new Date();

  Access.update({
    id,
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_UPDATE,
        context: err
      }, 500);

      else Global.success(res, {
        data,
        message: 'Sucessfully updated access control item'
      }, 200);
    }
  })
}

const remove = (req, res, next) => {
  let id = req.params.id;

  Access.delete({
    id,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_DELETE,
        context: err
      }, 500);

      else Global.success(res, {
        data,
        message: 'Sucessfully deleted access control item'
      }, 200)
    }
  });
}

const generateAccessControl = async (req, res, next) => {
  const data = [];
  const rolesQuery = `SELECT * FROM roles WHERE deleted IS null ORDER BY name`;

  let [errRole, roles] = await Global.exe(db.build(rolesQuery).promise());

  if (errRole) {
    Global.fail(res, {
      message: 'Failed to fetch roles',
    }, 204)
  }

  let superadminData = [
    {
      isRead: true,
      isWrite: true,
      isRemove: true,
      api_group: 'roles',
    },
    {
      isRead: true,
      isWrite: true,
      isRemove: true,
      api_group: 'content',
    },
    {
      isRead: true,
      isWrite: true,
      isRemove: true,
      api_group: 'access control',
    },
    {
      isRead: true,
      isWrite: true,
      isRemove: true,
      api_group: 'users',
    }
  ]

  let adminData = [{
    isRead: true,
    isWrite: true,
    isRemove: true,
    api_group: 'roles',
  },
  {
    isRead: true,
    isWrite: true,
    isRemove: true,
    api_group: 'content',
  },
  {
    isRead: true,
    isWrite: true,
    isRemove: true,
    api_group: 'access control',
  },
  {
    isRead: true,
    isWrite: true,
    isRemove: true,
    api_group: 'users',
  }]

  let readOnlyData = [{
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'roles',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'content',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'access control',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'users',
  }]

  let commonUserData = [{
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'roles',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'content',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'access control',
  },
  {
    isRead: true,
    isWrite: false,
    isRemove: false,
    api_group: 'users',
  }]

  roles.map(role => {
    if (role.name === 'superadmin') {
      superadminData.map(item => {
        data.push(
          {
            id: uuidv4(),
            isRead: item.isRead,
            isWrite: item.isWrite,
            isRemove: item.isRemove,
            api_group: item.api_group,
            role_id: role.id
          }
        )
      })
    }
    if (role.name === 'admin') {
      adminData.map(item => {
        data.push(
          {
            id: uuidv4(),
            isRead: item.isRead,
            isWrite: item.isWrite,
            isRemove: item.isRemove,
            api_group: item.api_group,
            role_id: role.id
          }
        )
      })
    }
    if (role.name === 'read-only') {
      readOnlyData.map(item => {
        data.push(
          {
            id: uuidv4(),
            isRead: item.isRead,
            isWrite: item.isWrite,
            isRemove: item.isRemove,
            api_group: item.api_group,
            role_id: role.id
          }
        )
      })
    }
    if (role.name === 'common-user') {
      commonUserData.map(item => {
        data.push(
          {
            id: uuidv4(),
            isRead: item.isRead,
            isWrite: item.isWrite,
            isRemove: item.isRemove,
            api_group: item.api_group,
            role_id: role.id
          }
        )
      })
    }
  })

  let accessQuery = `INSERT access_control_list SET ?`
  console.log(data)
  data.map(async item => {
    let [errAccess, access] = await Global.exe(db.build(accessQuery, item).promise())

    if (errAccess) {
      console.log(errAccess);
    }
  })

  Global.success(res, {
    data: data,
    message: 'Successs',
    context: 'Generation sucess'
  }, 200)
}

module.exports = {
  index,
  show,
  store,
  update,
  remove,
  generateAccessControl
}