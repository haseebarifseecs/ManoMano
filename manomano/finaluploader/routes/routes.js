const express = require('express');
const router = express.Router();
const fs = require("fs")
require('dotenv').config();
require("../database");
const multer = require("multer");
// const scrape = require("./scraper");
const product = require("../models/manomano");
const input = require("../models/inputData");
// const getLink = require("./example");
global.__basedir = __dirname;
const csv = require("csvtojson");

async function importExcelData2MongoDB(filePath) {
    const json = await csv({
        noheader: true,
        headers: ["idme", "keyword", "source"],
        delimiter: ';',
        quote: "off",
        ignoreEmpty: true,
    }).fromFile(filePath);
    let newJson = json.map(
        (el) => {
            if (Object.keys(el).length === 3) {
                return Object.fromEntries(
                    Object.entries(el).map((
                            [key, value]
                        ) => [key.replace('"', ''), value.replace('"', '')]


                    )

                )
            }
        }).filter((x) => {
        return x !== undefined;
    })
    console.log(newJson)

    return newJson
}



router.get("/", async function(req, res) {
    try {
        const data = await product.find();
        console.log(data);
        res.send(data);
    } catch (e) {
        res.send("Error");
    }
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({
    storage: storage
});

router.post('/upload', upload.single("uploadfile"), async (req, res) => {
    try {
        const filePathVar = __basedir + '/uploads/' + req.file.filename;
        const jsonData = await importExcelData2MongoDB(filePathVar);
        const bulkOps = jsonData.map(el => ({
            updateOne: {
                filter: {
                    keyword: el.keyword
                },
                update: {
                    idme: el.idme,
                    keyword: el.keyword,
                    source: el.source,
                },
                upsert: true,

            }
        }))
        await input.bulkWrite(bulkOps);
        console.log(filePathVar);
        fs.unlink(filePathVar, function (err) {
            if (err && err.code == 'ENOENT') {
                // file doens't exist
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                console.info("removed");
            }
        });
        res.status(200).json({
            'msg': 'File uploaded/import successfully!', 'file': req.file
        });
    } catch (e) {
        res.status(400).send(e.message);
    }
})

router.post("/scrape", async function (req, resp){
    try{
        let data = req.body;
        const idme = data.idme;
        const keyword = data.keyword;
        const url = data.source;
    }catch(e){
        res.status(400).send(e.message);
    }
})


/*router.post("/scrape",async function(req,res){
    res.set({
        'content-type': 'application/json',
     });
    try{
        let data = req.body;
        const idme = data.idme;
        const keyword = data.keyword;
        const url = data.source;
        const defaultResp =   {
            name:"N/A",
            keyword:keyword,
            idme:idme,
            source:url,
            pageUrl:"N/A",
            rank:"N/A",
            date:new Date(Date.now()).toDateString(),
            category:"N/A",
            status:500
        }
        try{
            const link = await getLink.getLink(keyword, url);
            if(link){
                const results = await scrape.scrape(link, idme);
                console.log(results);
                if(results){
                    result = results[0];
                    const insertResp = {
                        name:result.title,
                        keyword:keyword,
                        idme:idme,
                        source:url,
                        pageUrl:result.pageURL,
                        rank:result.rank,
                        date:new Date(Date.now()).toDateString(),
                        category:result.category
                    }
                    try{
                        await product.insertMany([insertResp]);
                        res.send(
                            {
                                name:result.title,
                                keyword:keyword,
                                idme:idme,
                                source:url,
                                pageUrl:result.pageURL,
                                rank:result.rank,
                                date:new Date(Date.now()).toDateString(),
                                category:result.category,
                                status:200
                            });
                    }catch(e){
                        console.error(e);
                        res.send(defaultResp);
                    }
                }
                else{
                    res.send(defaultResp);
                }


            }else{
                res.send(defaultResp);
            }
        }catch(e){
            console.error(e);
            res.send(defaultResp);
        }
        
     }catch(e){
        res.send("Invalid Request");
     }
})*/



/*router.get("/:IDME", async function(req,res){
    const idme = req.params.IDME;
    try{
        const check = typeof(parseInt(idme)) === 'number';
        if(check){
            try{
                const data = await product.find({
                    "idme":idme
                })
                res.send(data);
            }catch(e){
                console.error(e);
            }
        }else{
            res.send("ID Must be a Valid Integer");
        }
    }catch(e){
        res.send("ID Must be a Valid Integer");
    }
    
    

})
*/

module.exports = router;