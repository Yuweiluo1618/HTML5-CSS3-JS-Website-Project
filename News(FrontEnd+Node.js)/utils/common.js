
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

module.exports = {
    csrfProtect
}