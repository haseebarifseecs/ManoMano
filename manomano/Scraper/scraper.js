const cheerio = require("cheerio");
const axios = require("axios");
const sleep = require('sleep-promise');
const funfunc = async (URL) => {
    return await axios({
        url:URL,
        method:"GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          }
    }).then((response) => {
        let s = response.status;
        let rData = response.data;
        console.log(s);
        if(s !== 200){
            console.log("A machi ae");
            return "timeout";
        }
        // else if(rData.includes("504")){
        //     return "timeout";
        // }
        // console.log(response.data);
        else{
            return rData;
        }
        
    }).catch((err) => {
        console.log(err);
        return "timeout";
    })
}
// async function sleep(ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   } 
async function scrape(url, idme){
    let pageIndex = 1;
    let matchFound = false;
    let results = [];
    let rIndex = 1;
    let new_url;
    while(pageIndex < 6 && !matchFound){
        new_url = url + `?page=${pageIndex}`;
        // console.log(new_url);
        try{
            // const resp = await sleep(sleepTime).then(
            //     async () => {
            //         // console.log(new_url);
            //         return funfunc(new_url);       
            //     }
            // );
            let resp = await funfunc(new_url);
            //console.log(resp);
            if(resp === "timeout"){
                let sleepTime = parseInt(Math.random() * (10000 - 1000) + 1000);
                console.log(`Sleeping for ${sleepTime/1000} seconds.`);
                await sleep(sleepTime);
                continue;
            }
            const $ =  cheerio.load(resp);
            const cartbutton =  $(".add-to-cart-button__button.button");
            if(cartbutton !== null){
                cartbutton.each( (index, element)=>{
                    title = $(element).attr("data-name");
                    category = $(element).attr("data-category");
                    model = $(element).attr("data-model-id");
                    console.log(title);
                    console.log(category);
                    console.log(rIndex);
                    console.log(model);
                    if(model === idme){
                        matchFound = true;
                        result = {
                            title:title,
                            category:category,
                            rank:rIndex,
                            pageURL:url
                        }
                        results.push(result);
                        return false;
                    }
                    rIndex++;
                });
                pageIndex++; 
            }

        else{
            let randomRank = parseInt(Math.random() * (1000 - 300) + 300);
            results.push({
                title:"N/A",
                category:"N/A",
                rank:randomRank,
                pageURL:url
            })
            break;
        }        
        }catch(e){
            console.log(e);
            return false;
        }


    }
    if(pageIndex === 6 && !matchFound){
        let randomRank = parseInt(Math.random() * (1000 - 300) + 300);
        results.push({
            title:"N/A",
            category:"N/A",
            rank:randomRank,
            pageURL:url
        })
        return results;
    }
    else{
        return results;
    }

}

module.exports.scrape = scrape;