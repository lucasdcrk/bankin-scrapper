const rp = require('request-promise');
const config = require('./config');
const auth = require('./auth');
const fs = require('fs'); 

auth.get_token.then(function (token) {
    rp({
        uri: `https://sync.bankin.com/v2/accounts?limit=200&client_id=${config.client.id}&client_secret=${config.client.secret}`,
        method: 'GET',
        headers: {
            'User-Agent': config.headers.user_agent,
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Bankin-Version': config.headers.bankin_version,
            'Bankin-Device': config.headers.bankin_device,
            'Authorization': 'Bearer ' + token
        },
        parameters: {
            'limit': 200,
            'client_id': config.client.id,
            'client_secret': config.client.secret,
        }
    })
        .then(function (html) {
            let json = JSON.parse(html);
            let accounts = json.resources;

            fs.writeFile('accounts.json', JSON.stringify(accounts), 'utf8', function (err) {
                if (err) {
                    console.log('An error occured while writing JSON Object to File.');
                    return console.log(err);
                }
             
                console.log('JSON file has been saved.');
            }); 
        })
        .catch(function (err) {
            console.log(err)
        });
});
