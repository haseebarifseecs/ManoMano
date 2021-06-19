const { executablePath } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


async function createBrowserInstance(){
    const chromeOptions = {
        headless:true,
        agrgs:[
            "--no-sandbox",
        ],
    };
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    return page; 
}

async function processPage(dataset){
    const urlset = [];
    const page = await createBrowserInstance();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'document') {
            request.continue();
        } else { 
            request.abort();
        }

    });
    let tryVar = 0;
    let tryLimit = 2;
    for(let i = 0; i < dataset.length; i++){
        const idme = dataset[i].idme;
        const keyword = dataset[i].keyword;
        const url = dataset[i].source;
        await page.goto(url,{waitUntil: 'networkidle0'}).catch((err) => { 
            console.log(err);
        });
        await page.$eval('input[name=q]', (el, keyword ) =>{ 
            el.value = keyword;
        },keyword);
        while(tryVar <= tryLimit){
            try
            {
                const searchForm = await page.$("#searchbar-form");
                await searchForm.evaluate(searchForm => searchForm.submit());  
                let url = await page.evaluate(() => window.location.href);
                if(url){
                urlset.push(url);
                url = undefined;
                }
                if(url !== undefined){
                    break;
                }
            }
            catch(e){
                console.log(e);
                let sleepTime = parseInt(Math.random() * (10000 - 1000) + 1000);
                console.log(`Sleeping four ${sleepTime/1000} seconds.`);
                await sleep(sleepTime);
                continue
            }

        }

    }
    return urlset;


}
async function getLink(productName, webUrl){
    try{
        const chromeOptions = {
            headless:true,
            agrgs:[
                "--no-sandbox",
            ],
        };
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'document') {
                request.continue();
            } else { 
                request.abort();
            }
    
        });
        await page.setJavaScriptEnabled(false);
        await page.goto(webUrl,{waitUntil: 'networkidle0'}).catch((err) => { 
                 console.log(err);
             });
    
         await page.$eval('input[name=q]', (el, productName ) =>{ 
            el.value = productName;
        },productName);
        const searchForm = await page.$("#searchbar-form");
        await searchForm.evaluate(searchForm => searchForm.submit());   
        await page.waitForNavigation();
        const url = await page.evaluate(() => window.location.href);
        console.log(url);
        await page.close();
        await browser.close();
        return url;
     }
    catch(e){
        return "timeout";
    }
   
}


module.exports.getLink = getLink;