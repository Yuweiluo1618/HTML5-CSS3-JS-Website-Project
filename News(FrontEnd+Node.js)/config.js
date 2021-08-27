const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const common = require('./utils//common');
const keys = require("./keys");

const indexRouter = require("./router/index");
const passportRouter = require('./router/passport');
const detailRouter = require('./router/detail');
const profileRouter = require('./router/profile');
const testRouter = require('./router/test');

class Appconfig{
    constructor(app){
        this.app = app;
        this.listenPort = 8080;
        
        this.app.use(express.static(path.join(__dirname, "public")));

        this.app.engine('html', require('express-art-template'));
        this.app.set('view options', {debug: process.env.NODE_ENV !== 'production'});
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'html');

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.app.use(cookieParser());
        this.app.use(cookieSession({
            name:"my_session",
            keys:[keys.session_key],
            maxAge:1000*60*60*24*2   
        }));

        
        this.app.use(common.csrfProtect, indexRouter);
        this.app.use(common.csrfProtect, passportRouter);
        this.app.use(common.csrfProtect, detailRouter);
        this.app.use(common.csrfProtect, profileRouter);
        this.app.use(common.csrfProtect, testRouter);

        this.app.use((req, res)=>{
            
            common.abort404(req, res);
            
        });

    }
}

module.exports = Appconfig