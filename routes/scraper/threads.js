import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';


export async function threadsDownloader(url) {
const { data } = await axios.post('https://lovethreads.net/api/ajaxSearch',
qs.stringify({ q:url, lang:'en', thumbnail: 'media' }),{headers: { 'content-type': 'application/x-www-form-urlencoded' }})
const $ = cheerio.load(data.data)
const thumbnail = $('.download-items__thumb img').attr('src');
const video= $('.download-items__btn').eq(1).find('a').attr('href');
return { 
status:true, 
developer: 'https://t.me/krniwnstria', 
result:{
thumbnail,
video
}
}
}