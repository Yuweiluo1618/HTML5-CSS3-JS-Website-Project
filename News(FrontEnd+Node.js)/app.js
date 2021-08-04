const express = require('express');
const Appconfig = require('./config.js');
const app = express();

let appconfig = new Appconfig(app);

app.listen(appconfig.listenPort, () => {
    console.log(`Server started on port ${appconfig.listenPort}`);
});



