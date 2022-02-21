const db = require('anytv-node-mysql');
const Global = require('./../global_functions');
const AccessList = require('./../models/accessControlList.model')
// const Redis = require('redis');
// const redisClient = Redis.createClient();

require('./../misc/response_codes');
require('dotenv').config();


// const REDIS_EXPIRATION = process.env.REDIS_EXPIRATION || 3600;


const checkRoles = (apiGroup) => {
  return function (req, res, next) {
    const {
      id,
      role
    } = req.user;

    if (role === "SUPERUSER") next();

    let where = ` WHERE access.deleted IS null  `;

    if (apiGroup) {
      where += `
        AND access.api_group = '${apiGroup}'
      `
    }

    if (role) {
      where += `
        AND role.name = '${role}'
      `
    }

    AccessList.index({
      where,
      result: (err, data) => {
        if (err) {
          Global.fail(res, {
            message: FAILED_FETCH,
            context: err
          })
        }
        console.log("apiGroup", apiGroup)
        console.log('isWrite', data[0].isWrite)
        console.log('isWrite', data[0].isRemove)
        console.log('isRead', data[0].isRead)
        console.log("method", req.method)
        console.log("user", req.user)

        if (data.length === 0) {
          Global.fail(res, {
            message: UNAUTHORIZED_USER,
            context: UNAUTHORIZED_USER
          })
        }
        else {
          console.log("EXISTING")
          if (req.method === 'GET' && data[0].isRead === 1) {
            console.log("GET")
            next();

          }

          else if (req.method === 'PUT' || req.method === 'POST' && data[0].isWrite === 1) {
            console.log("PUT POST");
            next();
          }

          else if (req.method === 'DELETE' && data[0].isRemove === 1) {
            console.log("PUT POST");
            next();
          }
          else {
            Global.fail(res, {
              message: UNAUTHORIZED_USER,
              context: UNAUTHORIZED_USER
            }, 401)
          }
        }

      }
    })
  }
}




module.exports = {
  checkRoles
}