const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class GiphyFetcher{
    constructor(bundle)
    {
        this.base_url = process.env.GIPHYAPI_BASEURL;
        this.api_key = process.env.GIPHYAPI_APIKEY;
        this.limit = 25;
        this.random_id = crypto.randomUUID();
        this.bundle = bundle;
        this.offset = 0;
    }

    trend()
    {
        let query = {
            api_key: this.api_key,
            limit: this.limit,
            random_id: this.random_id,
            bundle: this.bundle,
            offset: this.offset
        };

        const queryParams = querystring.stringify(query);

        const apiUrl = this.base_url+`gifs/trending?${queryParams}`;


        const response = http.get(apiUrl, (response) => {
            let responseData = '';

            response.on('data',(chunk) => {responseData += chunk;});
            response.on('end', ()=>{
                const jsonData = JSON.parse(responseData);

                console.log(jsonData);

                return jsonData;
            }).on('error', (error)=> {console.error(`Error: ${error.message}`)});
        });
    }

}


(()=> {
    let giphyFetcher = new GiphyFetcher('original');
    let result = giphyFetcher.trend();
    let data = JSON.stringify(result, null, 2);
    fs.writeFile('test-data.json', data, (err)=>{
        if(err) throw err;
        console.log('Data written to file.');
    });
})();