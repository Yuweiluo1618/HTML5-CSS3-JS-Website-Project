const router = require('express').Router();
const handleDB = require('../db/handleDB');

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

router.get('/get_data', (req, res) => {
	(async ()=>{
        let result = await handleDB(res, "info_category", "find", "search error");
        res.send(result);
    })();
});

module.exports = router;