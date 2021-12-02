const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Tag = function (tag) {
    this.tag = tag;
};

Tag.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
    let query = `SELECT \
            tag.id, \
            tag.tag, \
            tag.created, \
            tag.updated, \
            tag.deleted \
            FROM tags tag  \
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

Tag.count = async ({ where = '', offset = '', result }) => {
    let query = `SELECT COUNT(*) AS total FROM tags tag ${where} ${offset}`;
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

Tag.show = async ({ id, where, result }) => {
    let query = `SELECT * FROM tags where id = '${id}'`;

    let [err, tag] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`TAG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`TAG DATA : `, tag[0]);
    result(null, tag[0]);
}

Tag.store = async ({ body, result }) => {
    let query = `INSERT INTO tags SET ?`;

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

Tag.update = async ({ id, body, result }) => {
    let query = `UPDATE  tags  SET ? where id = '${id}'`;

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

Tag.delete = async ({ id, result }) => {
    let query = `UPDATE tags SET deleted = NOW() WHERE id = '${id}'`;
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



module.exports = Tag;