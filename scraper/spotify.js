import axios from "axios"
import FormData from "form-data"

let tokenCache = {
  access_token: null,
  expires_at: 0
}

async function getSpotifyToken() {
  if (Date.now() < tokenCache.expires_at) {
    return tokenCache.access_token
  }

  const creds = Buffer.from(
    `fcd402f50a4b4e58a284de883ab5af7c:30b02187fd6841c6976db5333e152300`
  ).toString("base64")

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  )

  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000
  }

  return tokenCache.access_token
}

function extractTrackId(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

async function getSpotifyMeta(url) {
  const id = extractTrackId(url)
  if (!id) throw new Error("Invalid Spotify URL")

  const token = await getSpotifyToken()

  const { data } = await axios.get(
    `https://api.spotify.com/v1/tracks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return {
    id: data.id,
    title: data.name,
    artist: data.artists.map(a => a.name),
    album: data.album.name,
    duration: data.duration_ms,
    thumbnail: data.album.images[0]?.url
  }
}

export default async function Spotify(url) {
  try {
    if (!url) {
      return {
        status: false,
        code: 400,
        message: "URL is required",
        data: null
      }
    }

    const meta = await getSpotifyMeta(url)

    const payload = {
      url,
      quality: "128",
      title: meta.title,
      artist: meta.artist.join(", "),
      imageUrl: meta.thumbnail
    }

    const download = await axios.post(
      "https://spotitrack.com/api/proxy/download",
      payload,
      {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
          "Accept": "*/*",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Origin": "https://spotitrack.com",
          "Referer": "https://spotitrack.com/",
        },
        maxRedirects: 5
      }
    )

    const buffer = Buffer.from(download.data)

    const fileName = `${meta.title}.mp3`.replace(/[\\/:*?"<>|]/g, "")

    const form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("fileToUpload", buffer, {
      filename: "audio.mp3",
      contentType: "audio/mpeg"
    })

    const { data: uploadRes } = await axios.post(
      "https://catbox.moe/user/api.php",
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    )

    if (!uploadRes || !uploadRes.startsWith("http")) {
      throw new Error("Upload failed")
    }

    const cleanUrl = uploadRes.trim()

    return {
      status: true,
      code: 200,
      message: "Success",
      data: {
        id: meta.id,
        title: meta.title,
        artist: meta.artist,
        album: meta.album,
        duration: meta.duration,
        thumbnail: meta.thumbnail,
        download: cleanUrl
      }
    }

  } catch (e) {
    return {
      status: false,
      code: 500,
      message: "Internal server error",
      error: e.message,
      data: null
    }
  }
}