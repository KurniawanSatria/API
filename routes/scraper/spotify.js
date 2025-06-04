import axios from 'axios';

const CLIENT_ID = '4c4fc8c3496243cbba99b39826e2841f';
const CLIENT_SECRET = 'd598f89aba0946e2b85fb8aefa9ae4c8'


async function getAccessToken() {
const url = 'https://accounts.spotify.com/api/token';
const headers = {
'Content-Type': 'application/x-www-form-urlencoded',
'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
};
const data = new URLSearchParams({ grant_type: 'client_credentials' });

const response = await axios.post(url, data, { headers });
return response.data.access_token;
}

function formatDuration(ms) {
const minutes = Math.floor(ms / 60000);
const seconds = ((ms % 60000) / 1000).toFixed(0);
return `${minutes}:${seconds.padStart(2, "0")}`;
}

export async function spotifySearch(query) {
const accessToken = await getAccessToken();
const url = `https://api.spotify.com/v1/search`;
const headers = { 'Authorization': `Bearer ${accessToken}` };
const params = { q: query, type: 'track', market: 'ID' };

const response = await axios.get(url, { headers, params });
const results = response.data.tracks.items.map(track => ({
name: track.name,
artists: track.artists.map((artist) => artist.name).join(", "),
album: track.album.name,
release_date: track.album.release_date,
cover: track.album.images[0].url,
duration: formatDuration(track.duration_ms),
url: track.external_urls.spotify
}));

return {
status: 200,
developer: "https://t.me/krniwnstria",
results
};
}

export async function getRecommendations(seed_genres = 'pop') {
const accessToken = await getAccessToken();
const url = `https://api.spotify.com/v1/recommendations`;
const headers = { 'Authorization': `Bearer ${accessToken}` };
const params = {
limit: 10,
seed_genres,
};

const response = await axios.get(url, { headers, params });
const results = response.data.tracks.map(track => ({
name: track.name,
artists: track.artists.map((artist) => artist.name).join(", "),
album: track.album.name,
release_date: track.album.release_date,
cover: track.album.images[0]?.url || '',
duration: formatDuration(track.duration_ms),
url: track.external_urls.spotify,
}));

return {
status: 200,
developer: "https://t.me/krniwnstria",
results
};
}

const headers = {
"accept": "application/json, text/plain, */*",
"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
"sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
"sec-ch-ua-mobile": "?0",
"sec-ch-ua-platform": "\"Windows\"",
"sec-fetch-dest": "empty",
"sec-fetch-mode": "cors",
"sec-fetch-site": "cross-site",
"referer": "https://spotifydownload.org/",
"origin": "https://spotifydownload.org/",
"referrer-policy": "strict-origin-when-cross-origin",
}
export const spotifydl = async (url) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  // Fungsi buat format durasi dari ms ke format menit:detik
  const formatDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  try {
    if (!url) throw new Error('URL gak boleh kosong, bro! 😵');

    // Step 1: Ambil metadata dari Spotify URL
    const res = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`, { headers });
    if (!res.data?.result) throw new Error('Gagal ambil metadata dari Spotify API');

    // Step 2: Mulai proses convert MP3
    const res2 = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${res.data.result.gid}/${res.data.result.id}`, { headers });
    if (!res2.data?.result?.tid) throw new Error('Gagal mulai proses convert MP3');

    // Step 3: Cek progress dan ambil download URL
    let attempts = 0;
    const maxAttempts = 10; // Maksimal 10 coba, biar ga loop selamanya
    let downloadData;
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik per attempt
      downloadData = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-progress/${res2.data.result.tid}`, { headers });
      if (downloadData.data?.result?.download_url) break; // Keluar loop kalo dapet URL
      attempts++;
    }

    if (!downloadData.data?.result?.download_url) {
      throw new Error('Download URL is undefined after max attempts');
    }

    return {
      status: true,
      developer: 'https://t.me/krniwnstria',
      title: res.data.result.name,
      type: res.data.result.type,
      artist: res.data.result.artists,
      duration: formatDuration(res.data.result.duration_ms),
      cover: res.data.result.image,
      url: `https://api.fabdl.com${downloadData.data.result.download_url}`
    };
  } catch (error) {
    console.error(`Error di spotifydl: ${error.message} 😭`);
    throw error; // Lempar error biar ditangkap caller
  }
};