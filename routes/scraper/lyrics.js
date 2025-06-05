import got from 'got'
import * as cheerio from 'cheerio'
import { spotifySearch } from './spotify.js'
import { agent } from '../../index.js'

export async function sugest(query) {
if (!query || query.length < 1) throw new Error('query kosong 😞')
try {
const res = await fetch(`https://search.azlyrics.com/suggest.php?q=${encodeURIComponent(query)}`, {httpAgent: agent, timeout: 5000})
if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
let body = JSON.parse(await res.text())
body.songs.forEach(song => {
song.autocomplete = song.autocomplete.replace(/^"|"(?=\s*-)/g, '')
})
return body
} catch (err) {
console.error('gagal ambil sugesti:', err.message)
return { status: false, error: 'Gagal mengambil sugesti' }
}
}

export async function lyrics(songUrl) {
if (!songUrl) throw new Error('url kosong 😞')
try {
const res = await fetch(songUrl, {httpAgent: agent, timeout: 5000})
if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
const html = await res.text()
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
lyrics = part.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?i>/g, '').trim()
}
}
})

return { title: name, artist: artists, album, release_date, cover, url, lyrics }

} catch (err) {
console.error('gagal ambil lirik:', err.message)
return { status: false, error: 'Gagal mengambil lirik' }
}
}
