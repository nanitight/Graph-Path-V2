const express = require('express')
const router = express.Router();
const ManageUser = require('../../Services/ManageUser')

router.get('/userlist',(req, res, next)=> {

    var back = ManageUser.getAllUsers(body);
    res.send(back);
});

router.post('/insertUser',(req, res, next)=> {

    var body= req.body;
    if( ManageUser.insertNewUser(body) == 0){
        res.status(200).json({

            status: true,
            message: "The user was inserted successfully."

        })
    }else{
        res.status(200).json({

            status: false,
            message: "The user was not inserted successfully."

        })
    }
    //Pass body into function :   boolean insertNewUser(body)
    //if (insertNewUSer == true){
    //send response (JSON object) ={status:0, message: "user was inserted"}
    //}else{
    //send response (JSON object) ={status:1, message: "error"}
    //}
});

module.exports = router;