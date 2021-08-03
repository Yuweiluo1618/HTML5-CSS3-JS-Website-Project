const express = require('express');
const Appconfig = require('./config.js');
const generalRouter = require("./router/generalRouter");
const app = express();
const port = 3000;

new Appconfig(app);

app.use(generalRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



