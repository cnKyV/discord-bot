const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const GiphyConsts = require('../../consts/GiphyConsts');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

class GiphyFetcher{
    constructor(bundle = 'original', limit = 25, offset = 0)
    {
        this.base_url = process.env.GIPHYAPI_BASEURL;
        this.api_key = process.env.GIPHYAPI_APIKEY;
        this.limit = limit;
        this.random_id = crypto.randomUUID();
        this.bundle = bundle;
        this.offset = offset;
    }

    async trend(type, overrideLimit=-1) 
    {
        const query = {
            api_key: this.api_key,
            limit: overrideLimit === -1 ? this.limit : overrideLimit,
            random_id: this.random_id,
            bundle: this.bundle,
            offset: this.offset
        };

        const queryParams = querystring.stringify(query);

        const apiUrl = this.base_url+`${type}/trending?${queryParams}`;

        const response = await fetch(apiUrl);
        return await response.text();
    }

    async search(type, queryKeywords, overrideLimit=-1, language='en')
    {
        const query = {
            q:queryKeywords,
            api_key: this.api_key,
            limit: overrideLimit === -1 ? this.limit : overrideLimit,
            random_id: this.random_id,
            bundle: this.bundle,
            offset: this.offset,
            lang: language
        };

        const queryParams = querystring.stringify(query);

        const apiUrl = this.base_url+`${type}/search?${queryParams}`;

        const response = await fetch(apiUrl);
        return await response.text();
    }

    async random(type, tag, overrideLimit=-1)
    {
        
    }

    async translate(type, searchTerm, weirdness, overrideLimit=-1)
    {

    }

}


(async ()=> {
    let giphyFetcher = new GiphyFetcher('original',25,0);
    // let result = await giphyFetcher.trend(GiphyConsts.EndpointType.Gif);
    let result = await giphyFetcher.search(GiphyConsts.EndpointType.Gif, 'bleach');
    let parsedJson = JSON.parse(result);
    let data = JSON.stringify(parsedJson, null, 2);
    fs.writeFile('test-data.json', data, (err)=>{
        if(err) throw err;
        console.log('Data written to file.');
    });
})();