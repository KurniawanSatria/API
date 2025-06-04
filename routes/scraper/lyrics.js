import got from 'got'
import * as cheerio from 'cheerio'
import { spotifySearch } from './spotify.js'

export async function sugest(query) {
if (!query || query.length < 1) throw new Error('query kosong 😞')
const searchUrl = `https://search.azlyrics.com/suggest.php?q=${encodeURIComponent(query)}`

try {
const { body } = await got(searchUrl, {
headers: {
'User-Agent': 'Mozilla/5.0',
'Accept': 'application/json',
'Referer': 'https://www.azlyrics.com/'
},
responseType: 'json',
timeout: 5000
})

body.songs.forEach(song => {
song.autocomplete = song.autocomplete.replace(/^"|"(?=\s*-)/g, '')
})
return body

} catch (err) {
console.error('azlyrics request gagal, coba fallback:', err.message)
// fallback manual (proxy lu sendiri)
const backup = await got(`http://fr3.spaceify.eu:25135/v1/sugest?q=${encodeURIComponent(query)}`).json()
return backup
}
}

export async function lyrics(songUrl) {
if (!songUrl) throw new Error('url kosong 😞')

try {
const { body: html } = await got(songUrl, {
headers: {
'User-Agent': 'Mozilla/5.0',
'Referer': 'https://www.azlyrics.com/'
},
timeout: 5000
})

const $ = cheerio.load(html)
let rawTitle = $('.div-share h1').text().replace(/Lirik lagu |lyrics/gi, '').replace(/["']/g, '').trim()
let rawTist = $('.lyricsh h2 b').text().split('Lyrics')[0].trim()
const sp = await spotifySearch(`${rawTist} ${rawTitle}`)
let { cover, url, name, artists, album, release_date } = sp.results[0]

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

return { title: name, artist: artists, album, release_date, cover, url, lyrics }

} catch (err) {
console.error('gagal ambil lirik:', err.message)
throw new Error('gagal ambil lirik 😞')
}
}
