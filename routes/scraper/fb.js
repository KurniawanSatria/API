import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';


export async function fbDownloader(url) {
const { data } = await axios.post('https://www.fdown.world/result.php',qs.stringify({ codehap_link:url, codehap:false }),
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