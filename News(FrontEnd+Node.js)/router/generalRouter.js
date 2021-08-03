const router = require('express').Router();

router.all("/", (req, res)=>{
    if(req.method === "GET"){
        res.render('news/index')
    }
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

module.exports = router;