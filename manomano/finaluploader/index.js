const express = require('express');
const app = express();
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
})