
exports.response = (res,status,data)=>{
    res.status(status).send(data);
};