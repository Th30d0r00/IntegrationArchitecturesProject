const axios = require('axios');
const qs = require('qs');

const baseURL = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';
let accessToken = null;
let tokenExpiryTime = null;

async function getAccessToken() {

    if (accessToken && tokenExpiryTime > Date.now()) {
        return accessToken;
    }

    const body = qs.stringify({
        client_id : "api_oauth_id",
        client_secret : "oauth_secret",
        grant_type : "password",
        username : "penkert",
        password : "*Safb02da42Demo$"
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        }
    };

    try {
        const response = await axios.post(`${baseURL}/oauth/issueToken`, body, config);
        if (response.data.error) {
            console.error('Error getting access token:', response.data.error);
        }
        console.log('Response:', response.data);
        accessToken = response.data['access_token'];
        tokenExpiryTime = Date.now() + response.data['expires_in'] * 1000;
        console.log('Access token:', accessToken);
        return accessToken;
    } catch (err) {
        console.error('Error getting access token:', err);
        throw err;
    }
}

module.exports = {getAccessToken};