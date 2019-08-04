const express = require('express');
const app = express();
const rp = require('request-promise');
const NodeCache = require('node-cache');
const config = require('./config');
const auth = require('./auth');
const cache = new NodeCache({ stdTTL: 60*60*12, checkperiod: 60*60 });

let requires_auth = function (req, res, next) {
    const http_auth = { login: config.http.auth_username, password: config.http.auth_password };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');

    if (!config.http.auth_required) {
        return next()
    }

    if (login && password && login === http_auth.login && password === http_auth.password) {
        return next()
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.')
};

app.get('/', requires_auth, function (req, res) {
    cache.get('accounts', function (err, data) {
        console.log(data);
        if (typeof data !== "undefined") {
            res.send(JSON.parse(data));
        } else {
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
                        let total_balance = 0;

                        res.send(accounts);
                        cache.set('accounts', JSON.stringify(accounts));
                    })
                    .catch(function (err) {
                        console.log(err)
                    });
            });
        }
    });
});

app.listen(config.http.port, function () {
    console.log('App listening on port '+config.http.port);

    if (!config.http.auth_required) {
        console.log('WARNING: HTTP AUTH is disabled, everyone can access the API. Make sure you know what you\'re doing.')
    }
});

