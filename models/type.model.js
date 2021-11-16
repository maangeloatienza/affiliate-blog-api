const db = require('anytv-node-mysql');
const Global = require('../global_functions');


const Types = function (type) {
  this.type = type;
};

Types.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `SELECT \
            type.name,
            type.created,
            type.updated,
            type.deleted
            FROM types type
            ${where} ${offset}`;
  console.log('FETCH ALL', fetchAll)
  let [err, type] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`TYPE MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE DATA : `, type);
  result(null, type);

};

Types.count = async ({ where = '', offset = '', result }) => {
  let query = `SELECT COUNT(*) AS total FROM types type ${where} ${offset}`;
  console.log(query)
  let [err, type] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`type COUNT MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE count : `, type[0].total);
  result(null, type[0].total);
};

Types.show = async ({ id, where, result }) => {
  let query = `SELECT * FROM types where id = '${id}'`;

  let [err, type] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`TYPE MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE DATA : `, type[0]);
  result(null, type[0]);
}

Types.store = async ({ body, result }) => {
  let query = `INSERT INTO types SET ?`;

  let [err, type] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`TYPE MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE DATA : `, {
    id: type.insertId,
    ...body
  });
  result(null, {
    id: type.insertId,
    ...body
  });
};

Types.update = async ({ id, body, result }) => {
  let query = `UPDATE  tag_items  SET ? where id = '${id}'`;

  let [err, type] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`TYPE MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE UPDATED DATA: `, {
    id: id,
    ...body
  });

  result(null, {
    id: id,
    ...body
  });
}

Types.delete = async ({ id, result }) => {
  let query = `UPDATE tag_items SET deleted = NOW() where id = '${id}'`;
  console.log(query)
  let [err, type] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`TYPE MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TYPE DELETED ID: `, {
    id
  });
  result(null, {
    id: id
  });
}



module.exports = Types;