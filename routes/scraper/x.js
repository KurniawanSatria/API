import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';


export async function xDownloader(url) {
const { data } = await axios.post('https://savetwitter.net/api/ajaxSearch',
qs.stringify({ q:url, lang:'en', cftoken: '' }),{headers: { 'content-type': 'application/x-www-form-urlencoded' }})
const $ = cheerio.load(data.data)
const thumbnail = $('.thumbnail .image-tw img').attr('src');
const caption = $('.tw-middle .content h3').text().trim();
const downloadUrls = [];
$('.dl-action a.tw-button-dl').each((i, element) => {
const url = $(element).attr('href');
const label = $(element).text().trim();
downloadUrls.push({ url, label });
});
return { 
status:true, 
developer: 'https://t.me/krniwnstria', 
result:{
thumbnail,
caption,
downloadUrls
}
}
}