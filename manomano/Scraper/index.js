require('dotenv').config();
require("./database");
const scrape = require("./scraper");
const product = require("./models/manomano");
const input = require("./models/inputData");
const getLink = require("./example");
const sleep = require('sleep-promise');


// async function getGermanyData(){
//     try{
//         const germanData = await input.find({
//             source:"https://www.manomano.de"
//         })
//         return germanData;
//     }catch(e){
//         console.error(e);
//     }
    
// }

// async function getFranceData(){
//     try{
//         const franceData = await input.find({
//             source:"https://www.manomano.fr"
//         })
//         return franceData;
//     }catch(e){
//         console.error(e);
//     }
//     return franceData;
// }

// async function getItalyData(){
//     try{
//         const italyData = await input.find({
//             source:"https://www.manomano.it"
//         })
//         return italyData;
//     }catch(e){
//         console.error(e);
//     }
    
// }

// async function getUKData(){
//     try{
//         const ukData = await input.find({
//             source:"https://www.manomano.co.uk"
//         })
//         return ukData;
//     }catch(e){
//         console.error(e);
//     }
    
// }
// (async function(){
//     const fr = await getFranceData();
//     const de = await getGermanyData();
//     const it = await getItalyData();
//     const uk = await getUKData();
//     console.log(fr);
//     const frData = await bot.processPage(fr);
//     // const deData = await bot.processPage(de);
//     // const itData = await bot.processPage(it);
//     // const ukData = await bot.processPage(uk);
    
    
// })()
(async function(){
    try{
        let data = await input.find();
        if(data){
            for(let i = 0; i < data.length; i++){
                const idme = data[i].idme;
                const keyword = data[i].keyword;
                const url = data[i].source;
                console.log(idme, keyword, url);
                let link = await getLink.getLink(keyword, url);
                if(link === "timeout"){
                    let sleepTime = parseInt(Math.random() * (100000 - 9000) + 9000);
                    let link = await sleep(sleepTime).then(
                        async () => {
                            return getLink.getLink(keyword, url);;       
                        }
                    );
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
                            await product.insertMany([insertResp]);
                        }
                    }

                }
            

                
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
                        await product.insertMany([insertResp]);
                    }
                }
            }
        }
    }catch(e){
        console.error(e);
    }

})()
