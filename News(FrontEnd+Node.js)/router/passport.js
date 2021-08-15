const router = require('express').Router();
const Capcha = require("../utils/captcha/index");
const moment =  require("moment");
const handleDB = require('../db/handleDB');
const md5 = require("md5");
const keys = require("../keys");

require('../utils/filter')

router.get('/passport_test', (req, res) => {
    res.send("passport_test");
});

router.get('/passport/image_code/:date', (req, res) => {
    let capchaObj = new Capcha();
    let capcha = capchaObj.getCode();
    req.session['ImageCode'] = capcha.text;
    console.log(req.session);
    res.setHeader('Content-Type', 'image/svg+xml'); 
    res.send(capcha.data);
});

router.post('/passport/register', (req, res) => {
    
    (async function() {
        let { username, image_code, password, agree } = req.body;

        if (!username || !image_code || !password || !agree) {
            res.send({ errmsg: "params not provide" });
            return;
        }

        if (image_code.toLowerCase() !== (req.session['ImageCode']).toLowerCase()) {
            res.send({ errmsg: "Image Code not match" });
            return;
        }

        let searchRes = await handleDB(res, " info_user", "find", "databse find error", `username = "${username}"`);

        if(searchRes[0]){
            res.send({errmsg: "username is existed"});
            return;
        }

        let insertRes = await handleDB(res, "info_user", "insert", "database insert error", {nick_name: username, password_hash: md5(md5(password)+keys.password_salt), username, last_login: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')});

        req.session["user_id"] = insertRes.insertId;

        res.send({errno: "0", errmsg: "register successful"});


    })();

});

router.post('/passport/login', (req, res) => {

    (async function (){
        let {username, password} = req.body;
    
        if(!username || !password){
            res.send({errmsg: "params not provide"});
            return;
        }
    
        let search_res = await handleDB(res, "info_user", "find", "database find error", `username="${username}"`);

        console.log(search_res);
        

        if(!search_res[0]){
            res.send({errmsg: "user not existed"});
            return;
        }

        if(md5(md5(password)+keys.password_salt) !== search_res[0].password_hash){
            res.send({errmsg: "username or password not match"});
            return;
        }

        req.session["user_id"] = search_res[0].id;

        await handleDB(res, "info_user", "update", "database update error", `id = ${search_res[0].id}`, {last_login: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')});

        res.send({errno: "0", errmsg: "login successful"});


    })();
   
});

router.post('/passport/logout', (req, res) => {
    delete req.session["user_id"];
    res.send({errno: "0", errmsg: "logout successful"});
});




module.exports = router;


