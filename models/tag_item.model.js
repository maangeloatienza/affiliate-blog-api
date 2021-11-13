const db = require('anytv-node-mysql');
const Global = require('../global_functions');


const TagItem = function (tagItem) {
  this.tagItem = tagItem;
};

TagItem.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `SELECT \
            tagItems.id, \
            tag.tag, \
            blog.id, \
            tagItems.created, \
            tagItems.updated, \
            tagItems.deleted \
            FROM tag_items tagItems  \
            LEFT JOIN tags tag
            ON tag.id = tagItems.tags_id
            LEFT JOIN blogs blog
            ON blog.id = tagItems.news_id
            ${where} ${offset}`;
  console.log('FETCH ALL', fetchAll)
  let [err, tag] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`TAG MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG DATA : `, tag);
  result(null, tag);

};

TagItem.count = async ({ where = '', offset = '', result }) => {
  let query = `SELECT COUNT(*) AS total FROM tag_items tagItems ${where} ${offset}`;
  console.log(query)
  let [err, tag] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`TAG COUNT MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG count : `, tag[0].total);
  result(null, tag[0].total);
};

TagItem.show = async ({ id, where, result }) => {
  let query = `SELECT * FROM tag_items where id = '${id}'`;

  let [err, tag] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`TAG MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG DATA : `, tag[0]);
  result(null, tag[0]);
}

TagItem.store = async ({ body, result }) => {
  let query = `INSERT INTO tag_items SET ?`;

  let [err, tag] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`TAG MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG DATA : `, {
    id: tag.insertId,
    ...body
  });
  result(null, {
    id: tag.insertId,
    ...body
  });
};

TagItem.update = async ({ id, body, result }) => {
  let query = `UPDATE  tag_items  SET ? where id = '${id}'`;

  let [err, tag] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`TAG MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG UPDATED DATA: `, {
    id: id,
    ...body
  });

  result(null, {
    id: id,
    ...body
  });
}

TagItem.delete = async ({ id, result }) => {
  let query = `DELETE FROM tag_items where id = '${id}'`;
  console.log(query)
  let [err, tag] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`TAG MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`TAG DELETED ID: `, {
    id
  });
  result(null, {
    id: id
  });
}



module.exports = TagItem;