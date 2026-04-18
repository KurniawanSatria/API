import axios from "axios"
import qs from "qs"
import * as cheerio from "cheerio"

async function getToken() {
    const { data } = await axios.get("https://savegram.app/en", {
        headers: {
            "user-agent": "Mozilla/5.0"
        }
    })

    const $ = cheerio.load(data)

    let scriptContent = ""

    $("script").each((_, el) => {
        const html = $(el).html() || ""
        if (html.includes("k_token") && html.includes("k_exp")) {
            scriptContent = html
        }
    })

    const k_exp = scriptContent.match(/k_exp\s*=\s*"([^"]+)"/)?.[1]
    const k_token = scriptContent.match(/k_token\s*=\s*"([^"]+)"/)?.[1]

    if (!k_exp || !k_token) throw new Error("Token not found")

    return { k_exp, k_token }
}

function parseHTML(html) {
    const $ = cheerio.load(html)

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

    return media
}

export async function Instagram(url) {
    try {
        if (!url) {
            return {
                status: false,
                code: 400,
                message: "URL is required",
                data: null
            }
        }

        const { k_exp, k_token } = await getToken()

        const payload = qs.stringify({
            k_exp,
            k_token,
            q: url,
            t: "media",
            lang: "en",
            v: "v2"
        })

        const { data } = await axios.post(
            "https://savegram.app/api/ajaxSearch",
            payload,
            {
                timeout: 15000,
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "origin": "https://savegram.app",
                    "referer": "https://savegram.app/en",
                    "user-agent": "Mozilla/5.0"
                }
            }
        )

        const media = parseHTML(data.data)

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
                source: "savegram",
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