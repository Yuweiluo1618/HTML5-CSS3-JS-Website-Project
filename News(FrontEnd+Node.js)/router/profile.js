const router = require('express').Router();
const md5 = require('md5');
const keys = require('../keys');
const handleDB = require('../db/handleDB');
const common = require('../utils/common');
const constant = require('../utils/constant');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: './News(FrontEnd+Node.js)/public/news/upload/avatar'});

router.get('/profile', (req, res) => {

    (async function(){
        
        let user_info = await common.getUserInfo(req, res);

        let data = {
            user_info: {
                nick_name: user_info[0].nick_name,
                avatar_url: user_info[0].avatar_url?(constant.FILE_NAME_PRE+user_info[0].avatar_url):"/news/images/person01.png"
            }
        }
        
        res.render("news/user", data);
    })();
     	
});

router.all('/user/base_info', (req, res)=>{
    (async function(){
        
        let user_info = await common.getUserInfo(req, res);
        
        if(req.method === "GET"){
            let data = {
                nick_name: user_info[0].nick_name,
                signature: user_info[0].signature,
                gender: user_info[0].gender?user_info[0].gender:"MAN"
            }
            
            res.render('news/user_base_info', data);
        }
        else if(req.method === "POST"){
            let {signature, nick_name, gender} = req.body;
            
            if(!signature || !nick_name || !gender){
                res.send({errmsg: "params not match"});
                return;
            }

            await handleDB(res, "info_user", "update", "database update error", `id = ${user_info[0].id}`, {nick_name, signature, gender});

            res.send({errno: "0", errmsg: "update successful"});
        }

    })();
});

router.all('/user/pass_info', (req, res)=>{
    (async function(){
        
        let user_info = await common.getUserInfo(req, res);
        
        if(req.method === "GET"){
            res.render('news/user_pass_info');
        }
        else if(req.method === "POST"){
            
            let {old_password, new_password, new_password2} = req.body;

            if(!old_password || !new_password || !new_password2){
                res.send({errmsg: "params not match"});
                return;
            }

            if(new_password !== new_password2){
                res.send({errmsg: "new password not match"});
                return;
            }

            if(md5(md5(old_password)+keys.password_salt) !== user_info[0].password_hash){
                res.send({errmsg: "old password not match"});
                return;
            }

            await handleDB(res, "info_user", "update", "database update error", `id = ${user_info[0].id}`,{password_hash: md5(md5(new_password)+keys.password_salt)});

            res.send({errno: "0", errmsg: "password update successful"});


        }
    })();
});

router.get('/user/pic_info', (req, res) => {
    (async function(){
        
        let user_info = await common.getUserInfo(req, res);
        
        let data = {
            user_info: {
                avatar_url: constant.FILE_NAME_PRE+user_info[0].avatar_url
            }
        }
        
        res.render('news/user_pic_info', data)
    })();
});

router.post('/user/pic_info', upload.single('avatar'), (req, res) => {
    (async function(){
        let user_info = await common.getUserInfo(req, res);
        let file_create_date = Date.now();
        let new_file_name = `./News(FrontEnd+Node.js)/public/news/upload/avatar/${file_create_date}.jpg`;
        // fs.renameSync(`./${req.file.path}`, new_file_name);
        try{
            await new Promise((resolve, reject)=>{
                fs.rename(`./${req.file.path}`, new_file_name, err=>{
                   if(err){
                       reject(err);
                   }
                   resolve() 
                });
            });
        }
        catch(err){
            res.send({errmsg: "avatar upload error"});
        }
        
        let avatar_url = `${file_create_date}.jpg`
        await handleDB(res, "info_user", "update", "database update error", `id = ${user_info[0].id}`, {avatar_url});
        
        let data ={
            avatar_url: constant.FILE_NAME_PRE+avatar_url
        };

        res.send({errno: "0", errmsg: "avatar upload successful!", data});

    })();
   
    
});

module.exports = router;