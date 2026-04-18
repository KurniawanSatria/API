import axios from 'axios'
import qs from 'qs'
import * as cheerio from 'cheerio'

export default async function Threads(url) {
    try {
        if (!url) {
            return {
                success: false,
                code: 400,
                message: 'URL is required',
                data: null
            }
        }

        const { data } = await axios.post(
            'https://lovethreads.net/api/ajaxSearch',
            qs.stringify({ q: url, lang: 'en', t: 'media' }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'origin': 'https://lovethreads.net',
                    'referer': 'https://lovethreads.net/',
                }
            }
        )

        const html = data?.data || ''
        const $ = cheerio.load(html)

        const media = []

        $('.download-items').each((i, el) => {
            const thumbnail = $(el)
                .find('.download-items__thumb img')
                .attr('src') || null

            const link = $(el)
                .find('.download-items__btn a')
                .last()
                .attr('href') || null

            const iconClass = $(el)
                .find('.format-icon i')
                .attr('class') || ''

            let type = 'unknown'

            if (iconClass.includes('icon-dlvideo')) type = 'video'
            else if (iconClass.includes('icon-dlimage')) type = 'image'

            if (link) {
                media.push({
                    type,
                    url: link,
                    thumbnail
                })
            }
        })

        return {
            success: true,
            code: 200,
            message: 'Media fetched successfully',
            data: {
                media
            },
        }

    } catch (e) {
        return {
            success: false,
            code: 500,
            message: 'Internal server error',
            error: e.message
        }
    }
}