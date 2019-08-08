require('dotenv').config();

const credentials = {
    email: process.env.BANKIN_EMAIL,
    password: process.env.BANKIN_PASSWORD
};

const client = {
    id: process.env.CLIENT_ID || 'f8d39787dbdd491bb11924891241c97c',
    secret: process.env.CLIENT_SECRET || 'HzUGKTc7JVY7yys7IGi67jJBkzfoT4bNUIIk2odAmDDlHjaHoPSL05FnXSuAqp1q'
};

const headers = {
    user_agent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0',
    bankin_version: process.env.BANKIN_VERSION || '2018-06-15',
    bankin_device: process.env.BANKIN_DEVICE || '0e0f7832-03a2-4ff6-8b8d-74f36be53df3'
};


const config = {
    credentials,
    client,
    headers
};

module.exports = config;
