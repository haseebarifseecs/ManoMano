const mongoose = require("mongoose");
mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
}).then((res) => {
    console.log("Database Connected");
});

const connection = mongoose.connection;

connection.on("error",console.error.bind(console,"Error connecting to MongoDB:"));