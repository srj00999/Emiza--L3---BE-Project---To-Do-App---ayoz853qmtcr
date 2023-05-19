const Tasks   = require("../models/task.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "newtonSchool";

/*

req.body = {
    "task_id"    : task_id,
    "token"      : token
}

Response

1. Unabel to verify token (Invalid Token)
404 Status Code
json = 
{
    status: 'fail',
    message: 'Invalid token'
}

2. if Given task_id does not exist in Tasks 

404 Status code

json = {
    status: 'fail',
    message: 'Given task doesnot exist'
}

3. if creator_id of task that belong to task_id is not same as userId that we get from payload of token
   means this is not the owner of given task hence

403 Status code
json = 
{
    status: 'fail',
    message: 'Access Denied'
}

4. if creator_id of task that belong to task_id is same as userId that we get from payload of token
   means this is the owner of given task hence

200 Status code with allowing further.

*/

async function isowner(req, res, next) {

    try {
        const { token, task_id } = req.body;
        const { userId } = jwt.verify(token, JWT_SECRET);
        console.log(userId);
        // if (!validToken) return res.status(404).json({message: 'Invalid token hai ye bhakkk', status: 'fail'})
        const task = await Tasks.findOne({ _id: task_id });
        console.log(task);
        if (!task)
          return res
            .status(404)
            .json({ message: "Given task doesnot exist", status: "fail" });
        if (task.creator_id.toString() == !userId) {
          return res
            .status(403)
            .json({ message: "Access Denied", status: "fail" });
        }
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(404).json({
            message: "Invalid token",
            status: "fail",
          });
        }
        
    }
}

module.exports = { isowner };
