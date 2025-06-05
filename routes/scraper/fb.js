import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const proxyList = JSON.parse(fs.readFileSync(path.join(__dirname, "proxies.json"), "utf8"));
const proxyStrings = proxyList.map(p => `http://${p.ip_address}:${p.port}`)
const proxy = proxyStrings[Math.floor(Math.random() * proxyStrings.length)]
const agent = new HttpsProxyAgent(proxy)

export async function fbDownloader(url) {
const { data } = await axios.post('https://www.fdown.world/result.php',qs.stringify({ codehap_link:url, codehap:false }, {httpAgent: agent, timeout: 10000}),
{headers: { 
'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
'cookie': 'codehap_domain=www.fdown.world',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
}})
const $ = cheerio.load(data)
const thumbnail = $('div.col-sm-6.my-2').eq(1).find('img').attr('src');
const video = $('div.col-sm-6.my-2').eq(0).find('a').attr('href');
return { 
status:true, 
developer: 'https://t.me/krniwnstria', 
thumbnail,
video
}
}