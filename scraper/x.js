import axios from 'axios'
import qs from 'qs'
import * as cheerio from 'cheerio'

export default async function X(url) {
    try {
        if (!url) {
            return {
                status: false,
                code: 400,
                message: "URL is required",
                data: null
            }
        }

        const { data } = await axios.post(
            'https://savetwitter.net/api/ajaxSearch',
            qs.stringify({ q: url, lang: 'en', cftoken: '' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://savetwitter.net',
                    'Referer': 'https://savetwitter.net/',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 15000
            }
        )

        const $ = cheerio.load(data.data)

        const media = []

        $(".download-items").each((_, el) => {
            const thumbnail = $(el).find("img").attr("src")

            $(el).find("a").each((_, a) => {
                const href = $(a).attr("href")
                const text = $(a).text().trim()

                if (!href) return

                media.push({
                    type: text.toLowerCase().includes("video") ? "video" : "image",
                    quality: text,
                    url: href,
                    thumbnail
                })
            })
        })

        if (!media.length) {
            return {
                status: false,
                code: 404,
                message: "Media not found",
                data: null
            }
        }

        return {
            status: true,
            code: 200,
            message: "Success",
            data: {
                source: "savetwitter",
                media
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