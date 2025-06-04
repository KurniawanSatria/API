import axios from'axios'
import * as cheerio from 'cheerio'

export async function SpotifyDailyChart(country = 'global') {
try {
const { data } = await axios.get(`https://kworb.net/spotify/country/${country}_daily.html`)
const $ = cheerio.load(data)
const songs = []
$('#spotifydaily tr').each((i, element) => {
const rank = $(element).find('td').eq(0).text().trim();
const artistTitle = $(element).find('td').eq(2).text().trim();
const totalStream = $(element).find('td').eq(6).text().trim();
if (!artistTitle || !rank || isNaN(rank)) return;
const [artist, title] = artistTitle.split(' - ').map(str => str.trim());
songs.push({ rank: parseInt(rank), artist, title, totalStream });
});
return ({ status:true, developer: 'https://t.me/krniwnstria', description: $('.pagetitle').text(), songs })
} catch (err) {
console.error('Error fetching songs:', err)
}
}

//getTrendingSongs()
