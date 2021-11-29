const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Image = function (image) {
    this.image = image;
};

Image.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
    let query = `SELECT \
            image.id, \
            image.name, \
            image.image, \
            image.showcase, \
            image.created, \
            image.updated, \
            image.deleted \
            FROM images image  \
            ${where} ${offset}`;
    console.log(query)
    let [err, image] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`IMAGE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    result(null, image);

};

Image.count = async ({ where = '', offset = '', result }) => {
    let query = `SELECT COUNT(*) AS total FROM images image ${where} ${offset}`;

    let [err, image] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`IMAGE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`IMAGE count : `, image[0].total);
    result(null, image[0].total);
};

Image.show = async ({ id, where, result }) => {
    let query = `SELECT * FROM images where id = '${id}'`;

    let [err, image] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`BLOG MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`IMAGE DATA : `, image[0]);
    result(null, image[0]);
}

Image.store = async ({ body, result }) => {
    console.log('BODYYYY', result)
    let query = `INSERT INTO images SET ?`;

    let [err, image] = await Global.exe(db.build(query, body).promise());

    if (err) {
        console.log(`IMAGE MODEL ERROR: `, err);
        result(err, null);
        return;
    }


    console.log(`IMAGE DATA : `, {
        id: image.insertId,
        ...body
    });
    result(null, {
        id: image.insertId,
        ...body
    });
};

Image.update = async ({ id, body, result }) => {
    let query = `UPDATE  images  SET ? where id = '${id}'`;

    let [err, image] = await Global.exe(db.build(query, body).promise());

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

Image.delete = async ({ id, result }) => {
    let query = `UPDATE FROM images SET delete = NOW() WHERE id = '${id}'`;
    console.log(query)
    let [err, blog] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`IMAGE MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`IMAGE DELETED ID: `, {
        id
    });
    result(null, {
        id: id
    });
}



module.exports = Image;