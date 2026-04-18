import axios from "axios"

export default async function TikTok(url) {
  try {
    if (!url) {
      return {
        status: false,
        code: 400,
        message: "URL is required",
        data: null
      }
    }

    const body = new URLSearchParams({
      url,
      count: "12",
      cursor: "0",
      web: "1",
      hd: "1"
    })

    const { data: api } = await axios.post(
      "https://tikwm.com/api/",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    )

    if (api.code !== 0) {
      return {
        status: false,
        code: 400,
        message: api.msg || "API request failed",
        data: null
      }
    }

    const d = api.data

    const type =
      d.images?.length > 0
        ? "slide"
        : d.duration > 0 && (d.play || d.hdplay)
        ? "video"
        : "unknown"

    const base = {
      id: d.id,
      title: d.title,
      region: d.region,
      duration: d.duration,
      created_at: d.create_time,
      cover: `https://tikwm.com${d.cover}`,
      author: {
        id: d.author.id,
        username: d.author.unique_id,
        nickname: d.author.nickname,
        avatar: `https://tikwm.com${d.author.avatar}`
      },
      stats: {
        views: d.play_count,
        likes: d.digg_count,
        comments: d.comment_count,
        shares: d.share_count,
        downloads: d.download_count,
        favorites: d.collect_count
      },
      music: d.music_info
        ? {
            id: d.music_info.id,
            title: d.music_info.title,
            artist: d.music_info.author,
            duration: d.music_info.duration,
            is_original: d.music_info.original,
            url: d.music_info.play
          }
        : null
    }

    let extra = {}

    if (type === "video") {
      extra = {
        video: {
          no_watermark: `https://tikwm.com${d.play}`,
          watermark: `https://tikwm.com${d.wmplay}`,
          hd: `https://tikwm.com${d.hdplay}`,
          size: {
            normal: d.size,
            watermark: d.wm_size,
            hd: d.hd_size
          }
        },
        audio: `https://tikwm.com${d.music}`
      }
    }

    if (type === "slide") {
      extra = {
        images: d.images.map(v =>
          v.startsWith("http") ? v : `https://tikwm.com${v}`
        ),
        audio: `https://tikwm.com${d.music}`
      }
    }

    return {
      status: true,
      code: 200,
      message: "Success",
      data: {
        type,
        ...base,
        ...extra
      }
    }

  } catch (err) {
    return {
      status: false,
      code: 500,
      message: "Internal server error",
      error: err.message,
      data: null
    }
  }
}