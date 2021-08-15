const Base64 = require("js-base64").Base64;
const jwt = require('jsonwebtoken');
const md5 = require("md5");
const keys = require("../keys");
const router = require('express').Router();
    

router.get('/test_base64', (req, res) => {
    // res.send(Base64.encode('Man'));
    res.send(Base64.decode('TWFu'));
});

router.get("/test_md5", (req, res) =>{
    res.send(md5("741852963"));
});

router.get('/set_cookie', (req, res) => {
    res.cookie("name", "Node.js")
    res.send("set cookie")
});

router.get('/get_cookie', (req, res) => {
    res.send(req.cookies["name"]);	
});

router.get('/set_session', (req, res) => {
    req.session["age"] = 38;
    res.send("set session"); 
    
});

router.get('/get_session', (req, res) => {
    // console.log(req.session["age"]);
    res.send(req.session["age"]+ " ");
    
});

router.get('/get_data', (req, res) => {
	(async ()=>{
        let result = await handleDB(res, "info_category", "find", "search error");
        res.send(result);
    })();
});

router.get('/get_token', (req, res) => {
    const token = jwt.sign({id:1,username:"zhangsan"},keys.jwt_salt,{expiresIn: 60 * 60 * 2});
    res.send({
        errmsg: "success",
        errno: "0",
        reason: "assign token",
        result: {
            token
        }
    })
});



module.exports = router;