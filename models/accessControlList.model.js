const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const AccessList = function (accessList) {
  this.accessList = accessList
}

AccessList.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `
    SELECT
      access.id AS id,
      access.api_group,
      access.role_id,
      role.name,
      access.isRead,
      access.isWrite,
      access.isRemove,
      access.created,
      access.updated,
      access.deleted
    FROM
      access_control_list as access
    LEFT JOIN
      roles role
    ON
      role.id = access.role_id
    ${where} ${offset}
  `;
  console.log(query)
  let [err, access] = await Global.exe(db.build(query).promise());

  if (err) {
    result(err, null);
    return;
  }

  result(null, access)
}

AccessList.show = async ({ id, where = '', result }) => {
  let query = `
    SELECT
      access.id AS id,
      access.api_group,
      access.role_id,
      role.name,
      access.isRead,
      access.isWrite,
      access.isRemove,
      access.created,
      access.updated,
      access.deleted
    FROM
      access_control_list as access
    LEFT JOIN
      roles role
    ON
      role.id = access.role_id
    WHERE id = '${id}'
  `;

  let [err, access] = await Global.exe(db.build(query).promise());

  if (err) {
    result(err, null);
    return;
  }

  result(null, access)
}

AccessList.store = async ({ body, result }) => {
  let query = `INSERT INTO access_control_list SET ?`;

  let [err, access] = await Global.exe(db.build(query, body).promise());
  console.log(body)
  if (err) {
    console.log(`ACCESS CONTROL MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  result(null, {
    id: access.insertId,
    ...body
  });
}


module.exports = AccessList;