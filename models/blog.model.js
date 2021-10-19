const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Blog = function (blog) {
    this.blog = blog;
};

Blog.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
    let query = `SELECT \
            blog.id, \
            blog.title, \
            blog.excerpt, \
            blog.content, \
            blog.isAvailable, \
            blog.isFeatured, \
            blog.image, \
            tag.tag, \
            user.first_name, \
            user.last_name, \
            user.role_id,
            role.name,
            blog.created, \
            blog.updated, \
            blog.deleted \
            FROM blogs blog  \
            LEFT JOIN users user \
            ON user.id = blog.author_id \
            LEFT JOIN roles role
            ON role.id = user.role_id
            LEFT JOIN  tags tag
            ON tag.id = blog.tag_id
            ${where} ${offset}`;
    console.log('FETCH ALL', fetchAll)
    let [err, blog] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`BLOG DATA : `, blog);
    result(null, blog);

};

Blog.count = async ({ where = '', offset = '', result }) => {
    let query = `SELECT COUNT(*) AS total FROM blogs blog ${where} ${offset}`;

    let [err, blog] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`BLOG count : `, blog[0].total);
    result(null, blog[0].total);
};

Blog.show = async ({ id, where, result }) => {
    let query = `SELECT \
    blog.*, \
    tag.tag, \
    user.first_name, \
    user.last_name, \
    user.role_id, \
    role.name \
    FROM blogs blog  \
    LEFT JOIN users user \
    ON user.id = blog.author_id \
    LEFT JOIN roles role \
    ON role.id = user.role_id \
    LEFT JOIN  tags tag \
    ON tag.id = blog.tag_id \
    WHERE blog.id = '${id}'`;

    let [err, blog] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`BLOG DATA : `, blog[0]);
    result(null, blog[0]);
}

Blog.store = async ({ body, result }) => {
    let query = `INSERT INTO blogs SET ?`;

    let [err, blog] = await Global.exe(db.build(query, body).promise());

    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }


    console.log(`USER DATA : `, {
        id: blog.insertId,
        ...body
    });
    result(null, {
        id: blog.insertId,
        ...body
    });
};

Blog.update = async ({ id, body, result }) => {
    let query = `UPDATE  blogs  SET ? where id = '${id}'`;

    let [err, blog] = await Global.exe(db.build(query, body).promise());

    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`USER UPDATED DATA: `, {
        id: id,
        ...body
    });
    result(null, {
        id: id,
        ...body
    });
}

Blog.delete = async ({ id, result }) => {
    let query = `DELETE FROM blogs where id = '${id}'`;
    console.log(query)
    let [err, blog] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`BLOG DELETED ID: `, {
        id
    });
    result(null, {
        id: id
    });
}



module.exports = Blog;