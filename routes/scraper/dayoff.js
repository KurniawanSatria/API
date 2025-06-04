import axios from "axios";
import * as cheerio from "cheerio";

export async function dayoff(year) {
return new Promise(async (resolve, reject) => {
await axios
.get(`https://tanggalan.com/${year}`)
.then((a) => {
let $ = cheerio.load(a.data);
const result = []
$('article ul').each((i, el) => {
const bulan = $(el).find('li a').first().text().trim().replace(/\d/g, '').trim()
const tahun = $(el).find('li a').first().find('b').text().trim()
const tanggalMerah = []
const keterangan = {}
$(el).find('li a[style*="color: #f00"]').each((i, tag) => {
const tgl = $(tag).text().trim()
tanggalMerah.push(tgl)
})
$(el).find('table tr').each((i, row) => {
const tgl = $(row).find('td').eq(0).text().trim()
const ket = $(row).find('td').eq(1).text().trim()
if (tgl.includes('-')) {
const [start, end] = tgl.split('-').map(Number)
for (let d = start; d <= end; d++) {
keterangan[d.toString()] = ket
}
} else {
keterangan[tgl] = ket
}
})
tanggalMerah.forEach(tgl => {
result.push({
date: `${tgl} ${bulan} ${tahun}`,
reason: keterangan[tgl] || 'Hari Minggu / Libur Nasional'
})
})
})
resolve({status:true,developer: 'https://t.me/krniwnstria/',result});
});
});
}
