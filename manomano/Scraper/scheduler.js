const nodeCron = require("node-cron");
const shell = require("shelljs");


nodeCron.schedule("08 21 * * *",function(){
    console.log("Started");
    if(shell.exec("node index.js").code !== 0){
        console.log("Script Stopped")
    }
});