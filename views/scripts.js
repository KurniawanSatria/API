const modal = document.getElementById('welcome-modal');
const audio = new Audio("/assets/audio/JUDAS.mp3")
audio.loop = true
document.addEventListener('DOMContentLoaded', () => {
audio.load()
})
modal.showModal(); 
modal.addEventListener('close', () => {
modal.close();
audio.play();
});

// Baca system theme saat page load
const themeToggles = document.querySelectorAll('.theme-controller');
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const htmlElement = document.documentElement;

const syncThemeToggles = (isDark) => {
themeToggles.forEach(toggle => {
toggle.checked = isDark;
});
htmlElement.setAttribute('data-theme', isDark ? 'night' : 'dracula');
localStorage.setItem('theme', isDark ? 'night' : 'dracula');
};


// Load dari localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) syncThemeToggles(savedTheme === 'night');
else syncThemeToggles(isDarkMode);


// Listener buat semua toggle
themeToggles.forEach(toggle => {
toggle.addEventListener('change', () => {
syncThemeToggles(toggle.checked);
});
});

// Listener buat perubahan system theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
syncThemeToggles(e.matches);
});


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
