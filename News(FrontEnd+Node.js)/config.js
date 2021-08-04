const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const generalRouter = require("./router/generalRouter");
const passportRouter = require('./router/passport');

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
            keys:["%$#^&^%&TSFR#$TRGDRG$%GFDG%^$#%#^GFDGRDHG$#@^Y%"],
            maxAge:1000*60*60*24*2   
        }));

        
        this.app.use(generalRouter);
        this.app.use(passportRouter);

    }
}

module.exports = Appconfig