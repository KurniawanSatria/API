document.addEventListener('DOMContentLoaded', async() => {
let audio = new Audio("https://cybers-api.vercel.app/assets/audio/AUD-20250604-WA0075.mp3")
audio.loop = true
Swal.fire({
title: 'Yōkoso!',
text: '',
imageUrl:'https://avatanplus.com/files/resources/original/5eb247f13a723171e8690657.png',
imageWidth: 200,
imageHeight: 200,
background: '#09002F',
color: '#A1B1FF',
customClass: {
popup: 'rounded-lg shadow-lg',
confirmButton: 'menu-btn'
}
}).then((result) => {
audio.play()
});
})




setInterval(async () => {
fetch('/uptime')
.then(res => res.json())
.then(data => {
const now = new Date()
document.querySelector('.current-time-h').style = '--value:' + String(now.getHours()).padStart(2, '0')
document.querySelector('.current-time-m').style = '--value:' + String(now.getMinutes()).padStart(2, '0')
document.querySelector('.current-time-s').style = '--value:' + String(now.getSeconds()).padStart(2, '0')
document.querySelector('.uptime-h').style = `--value:${data.uptime.split(':')[0]}`
document.querySelector('.uptime-m').style = `--value:${data.uptime.split(':')[1]}`
document.querySelector('.uptime-s').style = `--value:${data.uptime.split(':')[2]}`
})

const res = await fetch('/system')
const data = await res.json()

document.getElementById('cpu').textContent = `${data.cpu}%`
document.querySelector('.progress-primary').value = `${data.cpu}`

document.getElementById('mem').textContent = `${data.memory}%`
document.querySelector('.progress-secondary').value = `${data.memory}`

document.getElementById('disk').textContent = `${data.disk}%`
document.querySelector('.progress-success').value = `${data.disk}`

document.getElementById('heap').textContent = `${data.heap}%`
document.querySelector('.progress-warning').value = `${data.heap}`
}, 1000) // disaranin ubah jadi 1000ms (1 detik) biar ga terlalu spam CPU

function formatCount(num) {
if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
return num.toString()
}
