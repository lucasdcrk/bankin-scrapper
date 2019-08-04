const rp = require('request-promise');
const config = require('./config');

let get_token = new Promise(function (resolve, reject) {
    rp({
        uri: `https://sync.bankin.com/v2/authenticate?client_id=${config.client.id}&client_secret=${config.client.secret}&email=${config.credentials.email}&password=${config.credentials.password}`,
        method: 'POST',
        headers: {
            'User-Agent': config.headers.user_agent,
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Bankin-Version': config.headers.bankin_version,
            'Bankin-Device': config.headers.bankin_device
        },
        parameters: {
            'client_id': config.client.id,
            'client_secret': config.client.secret,
            'email': config.credentials.email,
            'password': config.credentials.password
        }
    })
        .then(function(html){
            let json = JSON.parse(html);
            let token = json.access_token;

            resolve(token);
        })
        .catch(function(err){
            reject(err);
        });
});

exports.get_token = get_token;
