const handleDB =  require('../db/handleDB');


function getRandomString(n){
    var str="";
    while(str.length<n){
      str+=Math.random().toString(36).substr(2);
    }
    return str.substr(str.length-n)
}

function csrfProtect(req, res, next){
    if(req.method === "GET"){
        let csrf_token = getRandomString(48);
        res.cookie('csrf_token', csrf_token);
    }
    else if(req.method === "POST"){
        if(req.cookies['csrf_token'] !== req.headers["x-csrftoken"]){
            res.send({errmsg: "csrf validation not match"});
            return
        }
    }

    next();
}

async function getUser(req, res){
    
    let user_id = req.session["user_id"];
    let search_res = [];

    if (user_id) {
        search_res = await handleDB(res, "info_user", "find", "database search error", `id = ${user_id}`);
    }

    return search_res;

}

async function getUserInfo(req, res){
    let user_info = await getUser(req, res);
        
    if(!user_info[0]){
        res.redirect('/');
        return;
    }

    return user_info;
}

async function abort404(req, res){
    let user_info = await getUser(req, res);
    let data = {
        user_info: user_info[0] ? {
            nick_name: user_info[0].nick_name,
            avatar_url: user_info[0].avatar_url
        } : false
    }
    res.render("news/404", data);
}

module.exports = {
    csrfProtect,
    getUser,
    abort404,
    getUserInfo
}