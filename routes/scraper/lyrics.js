import got from 'got'
import * as cheerio from 'cheerio';
import { spotifySearch } from './spotify.js'


export async function sugest(query) {
if (!query || query.length < 1) throw new Error('query kosong 😞')
const searchUrl = `https://search.azlyrics.com/suggest.php?q=${encodeURIComponent(query)}`
const { body } = await got(searchUrl, {
headers: {
'Accept': 'application/json, text/javascript, */*; q=0.01',
'Accept-Encoding': 'gzip, deflate, br',
'Accept-Language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
'DNT': '1',
'Origin': 'https://www.azlyrics.com',
'Priority': 'u=1, i',
'Referer': 'https://www.azlyrics.com/',
'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
'Sec-Ch-Ua-Mobile': '?0',
'Sec-Ch-Ua-Platform': '"Windows"',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-site',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
},
responseType: 'json'
})
body.songs.forEach(song => {
song.autocomplete = song.autocomplete.replace(/^"|"(?=\s*-)/g, '') // hapus kutip awal & sebelum ' - '
})
return body
}


export async function lyrics(songUrl) {
if (!songUrl) throw new Error('url kosong 😞')
const { body: html } = await got(songUrl, {
headers: {
'Accept': 'application/json, text/javascript, */*; q=0.01',
'Accept-Encoding': 'gzip, deflate, br',
'Accept-Language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
'DNT': '1',
'Origin': 'https://www.azlyrics.com',
'Priority': 'u=1, i',
'Referer': 'https://www.azlyrics.com/',
'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
'Sec-Ch-Ua-Mobile': '?0',
'Sec-Ch-Ua-Platform': '"Windows"',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-site',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
}
})
const $ = cheerio.load(html)
let rawTitle = $('.div-share h1').text()
.replace(/Lirik lagu |lyrics/gi, '') // Bersihin "Lirik lagu" atau "lyrics" (case-insensitive)
.replace(/["']/g, '') // Bersihin kutip ganda dan tunggal
.trim()
let rawTist = $('.lyricsh h2 b').text()
.split('Lyrics')[0] // Ambil bagian sebelum "Lyrics"
.trim()
//console.log(`${rawTist} ${rawTitle}`) // Output: Pamungkas Monolog
const sp = await spotifySearch(`${rawTist} ${rawTitle.replace(/["]/g, '')}`)
let { cover, url, name, artists, album, release_date} = sp.results[0]
const title = name
const artist = artists
let lyrics = ''
$('div').each((_, el) => {
const htmlDiv = $(el).html()
if (htmlDiv && htmlDiv.includes('Usage of azlyrics.com content')) {
const part = htmlDiv.split('-->')[1]
if (part) {
lyrics = part.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?i>/g, '').replace(/\n{2,}/g, '\n').trim()
}
}
})

return {
title,
artist,
album,
release_date,
cover,
url,
lyrics
}
}