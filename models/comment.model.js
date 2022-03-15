const db = require('anytv-node-mysql');
const Global = require('./../global_functions');
const Blog = require('./blog.model');

const Comment = function (comment) {
  this.comment = comment
}

Comment.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `
    SELECT
      comment.id, \
      comment.blog_id AS blog_id, \
      comment.user_id AS user_id, \
      comment.content AS content, \
      user.id as user_id, \
      user.first_name as first_name, \
      user.last_name as last_name, \
      user.username as username, \ 
      user.email as email 
    FROM
      comments comment
    LEFT JOIN 
      blogs blog
    ON
      blog.id = comment.blog_id
    LEFT JOIN
      users user
    ON
      user.id = comment.user_id
    ${where}
    ${offset}
  `

  let [err, comment] = await Global.exe(db.build(query).promise());
  console.log(query)
  if (err) {
    console.log('COMMENT MODEL ERROR', err);
    result(err, null);
    return;
  }
  console.log("return content")
  result(null, comment)
}

Comment.count = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `
    SELECT \
      COUNT(*) AS total \
    FROM \
      comments comment \
    LEFT JOIN \
      blogs blog \
    ON \
      blog.id = comment.blog_id \
    ${where}
  `

  let [err, comment] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log('COMMENT MODEL ERROR', err);
    result(err, null);
    return;
  }

  result(null, comment[0].total)
}

Comment.show = async ({ id, where, result }) => {
  let query = `
      SELECT
        comment.id, \
        comment.blog_id AS blog_id, \
        comment.user_id AS user_id, \
        comment.content AS content, \
        user.first_name as first_name, \
        user.last_name as last_name, \
        user.username as username, \ 
        user.email as email 
      FROM
        comments comment
      LEFT JOIN 
        blogs blog
      ON
        blog.id = comment.blog_id
      LEFT JOIN
        users user
      ON
        user.id = comment.user_id
    WHERE comment.id = '${id}'
  `
  console.log(query)
  let [err, comment] = await Global.exe(db.build(query).promise())

  if (err) {
    console.log('COMMENT MODEL ERROR: ', err)
    result(err, null);
    return
  }

  result(null, comment[0]);
}


Comment.store = async ({ body, result }) => {
  let query = `INSERT INTO comments SET ? `;

  let [err, comment] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log('COMMENT MODEL ERROR: ', err);
    return
  }

  console.log('COMMENT DATA: ', {
    id: comment.insertId,
    ...body
  });
  result(null, {
    id: comment.insertId,
    ...body
  });
}

Comment.update = async ({ id, body, result }) => {
  let query = `UPDATE comments SET ? WHERE id = '${id}'`;

  let [err, comment] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log('COMMENT MODEL ERROR: ', err)
    result(err, null)
    return;
  }

  console.log('COMMENT UPDATED DATA: ', {
    id: id,
    ...body
  })

  result(null, {
    id: id,
    ...body
  })
}

Comment.delete = async ({ id, result }) => {
  let query = `UPDATE comments SET deleted = NOW() WHERE id = '${id}'`;

  let [err, comment] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log('COMMENT MODEL ERROR', err);
    result(err, null)
    return
  }

  result(null, {
    id: id
  })
}

module.exports = Comment;