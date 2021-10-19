const db = require('anytv-node-mysql');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const util = require('./../../utils/util');
const Global = require('./../../global_functions');
const Carousel = require('./../../models/carousel.model');

require('./../../misc/response_codes');

const reqBody = {
  src: '',
  _isActive: true
};

const optBody = {
  _src: '',
  _isActive: false
};



const index = (req, res, next) => {

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;
  const {
    src,
    isActive,
    search,
    sort_id,
    sort_desc
  } = req.query;

  let where = ` WHERE carousel.deleted IS null  `;

  if (sort_id) {
    where += `
            ORDER BY ${sort_id} ${sort_desc ? sort_desc : ASC}
        `;
  }

  if (isActive) {
    where += `
      AND carousel.isActive IS ${isActive} 
    `
  }

  if (src) {
    where += `
            AND carousel.src LIKE '%${carousel}%' \
        `
  }

  if (search) {
    where += `
            AND carousel.src LIKE '%${search}%' \
            
        `;
  }


  let count = 0;

  Carousel.count({
    where,
    offset,
    result: (err, data) => {
      count = data;
    }
  });

  Carousel.index({
    where,
    offset,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH,
        context: err
      }, 500);

      Global.success(res, {
        data,
        count,
        page,
        limit,
        message: data.length ? 'Sucessfully retrieved carousel' : NO_RESULTS
      }, data.length ? 200 : 404);
    }
  });
}

const show = (req, res, next) => {
  let id = req.params.id;

  Carousel.show({
    id,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_FETCH
      }, 500);

      else Global.success(res, {
        data,
        message: data ? 'Sucessfully retrieved carousel' : NO_RESULTS
      }, data ? 200 : 404);
    }
  });
}

const store = (req, res, next) => {
  const data =
    util._get
      .form_data(reqBody)
      .from(req.body);
  console.log(req.body)
  if (data instanceof Error) {
    return Global.fail(res, {
      message: INV_INPUT,
      context: data.message
    }, 500);
  }

  data.id = uuidv4();
  data.created = new Date();

  Carousel.store({
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_CREATE
      }, 500);

      else Global.success(res, {
        data,
        message: data ? 'Sucessfully added carousel' : FAILED_TO_CREATE
      }, data ? 200 : 400);
    }
  })
}

const update = (req, res, next) => {
  const data =
    util._get
      .form_data(optBody)
      .from(req.body);

  if (data instanceof Error) {
    Global.fail(res, {
      message: INV_INPUT,
      context: INV_INPUT
    }, 500);
  }

  const id = req.params.id;

  data.updated = new Date();

  Carousel.update({
    id,
    body: data,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_UPDATE,
        context: err
      }, 500);

      else Global.success(res, {
        data,
        message: 'Sucessfully updated carousel'
      }, 200);
    }
  })


}

const remove = (req, res, next) => {
  let id = req.params.id;

  Carousel.delete({
    id,
    result: (err, data) => {
      if (err) Global.fail(res, {
        message: FAILED_TO_DELETE,
        context: err
      }, 500);

      else Global.success(res, {
        data,
        message: 'Sucessfully deleted carousel'
      }, 200)
    }
  });
}



module.exports = {
  index,
  show,
  store,
  update,
  remove
}