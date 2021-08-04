const router = require('express').Router();
const Capcha = require("../utils/captcha/index")

router.get('/passport_test', (req, res) => {
    res.send("passport_test");
});

// //test code
// router.get('/get_code', (req, res) => {
//     let capchaObj = new Capcha();
//     let capcha = capchaObj.getCode();
//     res.setHeader('Content-Type', 'image/svg+xml'); 
//     res.send(capcha.data);
// });

router.get('/passport/image_code/:date', (req, res) => {
    let capchaObj = new Capcha();
    let capcha = capchaObj.getCode();
    req.session['ImageCode'] = capcha.text;
    console.log(req.session);
    res.setHeader('Content-Type', 'image/svg+xml'); 
    res.send(capcha.data);
});




module.exports = router;


