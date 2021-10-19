const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const Carousel = function (carousel) {
  this.carousel = carousel;
};

Carousel.index = async ({ fetchAll = false, where = '', offset = '', result }) => {
  let query = `SELECT \
            *
            FROM carousel carousel  \
            ${where} ${offset}`;
  console.log('FETCH ALL', fetchAll)
  let [err, carousel] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`role MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`CAROUSEL DATA : `, carousel);
  result(null, carousel);

};

Carousel.count = async ({ where = '', offset = '', result }) => {
  let query = `SELECT COUNT(*) AS total FROM carousel carousel ${where} ${offset}`;
  console.log(query)
  let [err, carousel] = await Global.exe(db.build(query).promise());
  if (err) {
    console.log(`CAROUSEL COUNT MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`carousel count : `, carousel[0].total);
  result(null, carousel[0].total);
};

Carousel.show = async ({ id, where, result }) => {
  let query = `SELECT * FROM carousel carousel where id = '${id}'`;

  let [err, carousel] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`CAROUSEL MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`CAROUSEL DATA : `, carousel[0]);
  result(null, carousel[0]);
}

Carousel.store = async ({ body, result }) => {
  let query = `INSERT INTO carousel SET ?`;

  let [err, carousel] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`CAROUSEL MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`CAROUSEL DATA : `, {
    id: carousel.insertId,
    ...body
  });
  result(null, {
    id: carousel.insertId,
    ...body
  });
};

Carousel.update = async ({ id, body, result }) => {
  let query = `UPDATE  carousel  SET ? where id = '${id}'`;

  let [err, carousel] = await Global.exe(db.build(query, body).promise());

  if (err) {
    console.log(`CAROUSEL MODEL ERROR: `, err);
    result(err, null);
    return;
  }

  console.log(`CAROUSEL UPDATED DATA: `, {
    id: id,
    ...body
  });

  result(null, {
    id: id,
    ...body
  });
}

Carousel.delete = async ({ id, result }) => {
  let query = `DELETE FROM carousel where id = '${id}'`;
  console.log(query)
  let [err, carousel] = await Global.exe(db.build(query).promise());

  if (err) {
    console.log(`CAROUSEL MODEL ERROR: `, err);
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



module.exports = Carousel;