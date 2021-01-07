const db = require('anytv-node-mysql');
const Global = require('./../global_functions');


const User = function(user){
    this.user = user;
};

User.index = async ({fetchAll = false ,where = '', offset = '', result }) => {
    let query = `SELECT \
            user.id AS id, \
            first_name,\
            last_name, \
            username, \
            password, \
            email, \
            phone_number, \
            name AS role, \
            user.created, \
            user.updated, \
            user.deleted \
            FROM users user  \
            LEFT JOIN roles role \
            ON role.id = user.role_id \
            ${where} ${offset}`;
    console.log('FETCH ALL',fetchAll)
    let [err,user] = await Global.exe(db.build(query).promise());
    if(err){
        console.log(`USER MODEL ERROR: `,err);
        result(err,null);
        return;
    }

    if(!fetchAll) {
        for (let key in user) {
            delete user[key].password;
        }
    }
    
    console.log(`USER DATA : `,user);
    result(null, user);
    
};

User.count = async ({ where = '', offset = '', result }) => {
    let query = `SELECT COUNT(*) AS total FROM users user ${where} ${offset}`;

    let [err, user] = await Global.exe(db.build(query).promise());
    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`USER count : `, user[0].total);
    result(null, user[0].total);
};

User.show = async ({id,where,result}) => {
    let query = `SELECT * FROM users where id = '${id}'`;

    let [err,user] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`USER DATA : `, user[0]);
    result(null, user[0]);
}   

User.store = async ({body,result}) => {
    let query = `INSERT INTO users SET ?`;

    let [err,user] = await Global.exe(db.build(query,body).promise());

    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }
    
    delete body.password;

    console.log(`USER DATA : `,{
        id: user.insertId,
        ...body
    });
    result(null, {
        id : user.insertId,
        ...body
    });
};

User.update = async ({ id, body, result }) => {
    let query = `UPDATE  users  SET ? where id = '${id}'`;

    let [err, user] = await Global.exe(db.build(query,body).promise());

    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    delete body.password;

    console.log(`USER UPDATED DATA: `, {
        id: id,
        ...body
    });
    result(null, {
        id: id,
        ...body
    });
} 

User.delete = async ({ id, result }) => {
    let query = `DELETE FROM users where id = '${id}'`;
    console.log(query)
    let [err, user] = await Global.exe(db.build(query).promise());

    if (err) {
        console.log(`USER MODEL ERROR: `, err);
        result(err, null);
        return;
    }

    console.log(`USER DELETED ID: `, {
        id
    });
    result(null, {
        id : id
    });
}



module.exports = User;