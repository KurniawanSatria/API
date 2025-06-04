import got from 'got'
import * as cheerio from 'cheerio';
import { spotifySearch } from './spotify.js'


export async function sugest(query) {
if (!query || query.length < 1) throw new Error('query kosong 😞')
const searchUrl = `https://search.azlyrics.com/suggest.php?q=${encodeURIComponent(query)}`
const { body } = await got(searchUrl, {
headers: {
'User-Agent': 'Mozilla/5.0'
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
'User-Agent': 'Mozilla/5.0'
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