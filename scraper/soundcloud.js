import axios from "axios"
import * as cheerio from "cheerio"
import fakeUa from "fake-useragent"
import crypto from "crypto"

const BASE_URL_POST = 'https://rycvzz5nh5shm3bq5caekjrnvu0aadef.lambda-url.us-east-1.on.aws/'
const BASE_URL_GET = 'https://l2tv6fpgy7.execute-api.us-east-1.amazonaws.com/default/free_version_musicverter_python'

const delay = ms => new Promise(r => setTimeout(r, ms))

export default async function SoundCloud(url, retries = 3) {
    try {
        if (!url) {
            return {
                success: false,
                code: 400,
                message: 'URL is required',
                data: null
            }
        }

        const userId = crypto.randomUUID()

        await axios.post(BASE_URL_POST, { link: url }, {
            headers: { 'Content-Type': 'application/json' }
        })

        await delay(1000)

        let lastError

        for (let i = 0; i < retries; i++) {
            try {
                const { data } = await axios.get(BASE_URL_GET, {
                    params: {
                        plan_type: 'free_downloaded_song',
                        link: url
                    },
                    headers: {
                        'Accept': '*/*',
                        'userid': userId,
                        'Origin': 'https://soundcloud.com',
                        'Referer': 'https://soundcloud.com/'
                    }
                })

                return {
                    success: true,
                    code: 200,
                    message: 'Download fetched successfully',
                    data: {
                        title: data.title || null,
                        author: data.author || null,
                        thumbnail: data.thumbnail || null,
                        download: data.link || null
                    }
                }

            } catch (e) {
                lastError = e
                await delay(2000 * (i + 1))
            }
        }

        throw lastError

    } catch (e) {
        return {
            success: false,
            code: e?.response?.status || 500,
            message: 'Failed to fetch download',
            error: e.message
        }
    }
}
