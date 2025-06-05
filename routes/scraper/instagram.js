import axios from 'axios';
import qs from 'qs';
import * as cheerio from 'cheerio';
import { agent } from '../../index.js';


export async function igDownloader(url) {
const { data } = await axios.post('https://snapins.ai/action.php',
qs.stringify({ url }),{httpAgent: agent, headers: { 'content-type': 'application/x-www-form-urlencoded' }})
const res = data.data
const mediaList = res.map(m => {
const obj = {}
if (m.type === 'video') obj.video = { url: m.videoUrl }
else obj.image = { url: m.imageUrl }
return obj
})
return { 
status:true, 
developer: 'https://t.me/krniwnstria', 
result:{
author:{
id: res[0].author.id,
name: res[0].author.name,
username: res[0].author.username,
avatar: res[0].author.avatar,
}, 
media: mediaList 
}
}
}


