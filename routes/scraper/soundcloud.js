import axios from "axios";
import * as cheerio from "cheerio";
import fakeUa from "fake-useragent";
import FormData from "form-data";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import vm from 'vm';
import crypto from 'crypto';



const BASE_URL_POST = 'https://rycvzz5nh5shm3bq5caekjrnvu0aadef.lambda-url.us-east-1.on.aws/';
const BASE_URL_GET = 'https://l2tv6fpgy7.execute-api.us-east-1.amazonaws.com/default/free_version_musicverter_python';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));



export async function soundc(url, retries = 3) {
try {
const userId = crypto.randomUUID();
const postResponse = await axios.post(BASE_URL_POST, {
link: url
}, {
headers: {
'Content-Type': 'application/json'
}
});
await delay(1000);
let lastError;
for (let i = 0; i < retries; i++) {
try {
const getResponse = await axios.get(`${BASE_URL_GET}`, {
params: {
plan_type: 'free_downloaded_song',
link: url
},
headers: {
'Accept': '*/*',
'userid': userId,
'Origin': 'https://soundcloud.com',
'Referer': 'https://soundcloud.com/'
}
});
return {
status: 200,
developer: 'https://t.me/krniwnstria/',
link: getResponse.data.link,
};
} catch (error) {
lastError = error;
await delay(2000 * (i + 1));
}
}
throw lastError;
} catch (error) {
if (error.response) {
throw new Error(`API Error: ${error.response.status} - ${error.response.data}`);
}
throw error;
}
}

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

class SoundCloud {
search = function search(query) {
return new Promise(async (resolve, reject) => {
try {
let res = await axios.get("https://proxy.searchsoundcloud.com/tracks?q="+query.replace(/ /g, "+"));
let final = res.data.collection.map((track) => ({
title: track.title,
author: track.user.username,
url: track.permalink_url,
artwork: track.artwork_url,
duration: millisecondsToTime(track.duration),
playback_count: formatNumber(track.playback_count),
total_likes: formatNumber(track.likes_count),
created_at: track.created_at,
}));
resolve({
status: true,
developer: 'https://t.me/krniwnstria/',
result_count: final.length,
result: final,
});
} catch (error) {
reject({
status: false,
developer: 'https://t.me/krniwnstria/',
message: error.message,
});
}
});
};


download = function download(url) {
return new Promise(async (resolve, reject) => {
try {
const { data } = await axios.get('https://cloudmp3.cc/en/download?url='+ url,{headers: {"User-Agent": fakeUa()}});
const $ = cheerio.load(data)
let scriptContent = ''
$('script[type="text/javascript"]').each((i, el) => {
const html = $(el).html()
if (html.includes('scdler.init(')) {
scriptContent = html.split('scdler.init(')[1].split(');')[0]
}
})
const audioUrl = scriptContent.split(`{"audio": `)[1].split(`}, "quality":`)[0]
resolve({
status: true,
developer: 'https://t.me/krniwnstria/',
link: audioUrl.replace(/\\u0026/g, '&').split(`\"`)[1].split(`\"`)[0]})
} catch (error) {
console.error(error);
reject({
status: false,
developer: 'https://t.me/krniwnstria/',
message: error.message,
});
}
});
};
}

function millisecondsToTime(ms) {
let seconds = Math.floor(ms / 1000) % 60;
let minutes = Math.floor(ms / 60000) % 60;
let hours = Math.floor(ms / 3600000);
return (
(hours ? hours + ":" : "") +
(minutes < 10 && hours ? "0" : "") +
minutes +
":" +
(seconds < 10 ? "0" : "") +
seconds
);
}

function formatNumber(num) {
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default new SoundCloud();