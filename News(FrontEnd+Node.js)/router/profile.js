const router = require('express').Router();
const common = require('../utils/common');

router.get('/profile', (req, res) => {

    (async function(){
        let userInfo = await common.getUser(req, res);
        if(!userInfo[0]){
            res.redirect('/');
            return;
        }
        
        let data = {
            user_info: userInfo[0]
        }
        res.render("news/user", data);
    })();
     	
});

module.exports = router;