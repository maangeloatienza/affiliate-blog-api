const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Role = function (role) {
  this.role = role;
};

Role.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `SELECT \
            role.id, \
            role.name, \
            role.created, \
            role.updated, \
            role.deleted \
            FROM roles role  \
            ${where} ${offset}`;
  console.log('FETCH ALL', fetchAll)
  let [err, role] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role DATA : `, role);
  result(null, role);

};

Role.count = async ({ where = '', offset = '', result }) => {
  let query = `SELECT COUNT(*) AS total FROM roles role ${where} ${offset}`;
  console.log(query)
  let [err, role] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`role COUNT MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role count : `, role[0].total);
  result(null, role[0].total);
};

Role.show = async ({ id, where, result }) => {
  let query = `SELECT * FROM roles where id = '${id}'`;

  let [err, role] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role DATA : `, role[0]);
  result(null, role[0]);
}

Role.store = async ({ body, result }) => {
  let query = `INSERT INTO roles SET ?`;

  let [err, role] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role DATA : `, {
    id: role.insertId,
    ...body
  });
  result(null, {
    id: role.insertId,
    ...body
  });
};

Role.update = async ({ id, body, result }) => {
  let query = `UPDATE  roles  SET ? where id = '${id}'`;

  let [err, role] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role UPDATED DATA: `, {
    id: id,
    ...body
  });

  result(null, {
    id: id,
    ...body
  });
}

Role.delete = async ({ id, result }) => {
  let query = `UPDATE roles SET deleted = NOW() WHERE id = '${id}'`;
  console.log(query)
  let [err, role] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`role DELETED ID: `, {
    id
  });
  result(null, {
    id: id
  });
}



module.exports = Role;