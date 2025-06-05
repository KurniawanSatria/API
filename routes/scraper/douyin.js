import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';
import { agent } from '../../index.js';


export async function dyDownloader(url) {
const { data } = await axios.get(`https://dlpanda.com/?url=${url}&token=G7eRpMaa`, {httpAgent: agent, timeout: 10000})
const $ = cheerio.load(data)
const downloadUrls = []
let videoSrc = $('div.domain-info-wrap video source').attr('src')
if (videoSrc) {
downloadUrls.push({ video:{url: videoSrc.startsWith('//') ? 'https:' + videoSrc : videoSrc} })
} else {
$('div.domain-info-wrap').find('div.col-md-12.col-lg-6').each((i, el) => {
const imgUrl = $(el).find('img').attr('src')
if (imgUrl) downloadUrls.push({ image: {url: imgUrl} })
})
}
return downloadUrls
}