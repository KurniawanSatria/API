# Downify

Multi-platform media downloader API

## Install & Run

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`

## API Endpoints

### POST /api/youtube
```bash
curl -X POST http://localhost:3000/api/youtube \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=xxx"}'
```
Response:
```json
{
  "status": true,
  "result": {
    "title": "...",
    "thumbnail": "...",
    "videoId": "...",
    "download": "...",
    "audio": "..."
  }
}
```

### POST /api/instagram
```bash
curl -X POST http://localhost:3000/api/instagram \
  -H "Content-Type: application/json" \
  -d '{"url": "https://instagram.com/p/xxx"}'
```
Response:
```json
{
  "status": true,
  "result": {
    "author": { "id": "...", "name": "...", "username": "...", "avatar": "..." },
    "media": [{ "image": { "url": "..." } }]
  }
}
```

### POST /api/facebook
```bash
curl -X POST http://localhost:3000/api/facebook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://facebook.com/xxx"}'
```

### POST /api/x
```bash
curl -X POST http://localhost:3000/api/x \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/xxx/status/xxx"}'
```

### POST /api/threads
```bash
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"url": "https://threads.net/xxx"}'
```

### POST /api/tiktok
```bash
curl -X POST http://localhost:3000/api/tiktok \
  -H "Content-Type: application/json" \
  -d '{"url": "https://tiktok.com/@xxx/video/xxx"}'
```

### POST /api/spotify
```bash
curl -X POST http://localhost:3000/api/spotify \
  -H "Content-Type: application/json" \
  -d '{"url": "https://open.spotify.com/track/xxx"}'
```

### GET /api/soundcloud/search
```bash
curl "http://localhost:3000/api/soundcloud/search?q=artist"
```

### GET /api/soundcloud/download
```bash
curl "http://localhost:3000/api/soundcloud/download?url=https://soundcloud.com/artist/track"
```

## Example Code (JavaScript)

```javascript
const download = async (platform, url) => {
  const endpoints = {
    instagram: 'http://localhost:3000/api/instagram',
    facebook: 'http://localhost:3000/api/facebook',
    x: 'http://localhost:3000/api/x',
    threads: 'http://localhost:3000/api/threads',
    tiktok: 'http://localhost:3000/api/tiktok',
    spotify: 'http://localhost:3000/api/spotify'
  };

  const response = await fetch(endpoints[platform], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  const data = await response.json();
  console.log(data);
};

download('instagram', 'https://instagram.com/p/xxx');
```

## Supported Platforms

- YouTube
- Instagram
- Facebook
- X (Twitter)
- Threads
- TikTok
- Spotify
- SoundCloud

## API Reference

### POST /api/youtube