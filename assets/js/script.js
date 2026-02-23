document.addEventListener("DOMContentLoaded", function () {

initArtikel();
initJadwalSholat();

});

/* =========================
   ARTIKEL DINAMIS
========================= */

function initArtikel(){

const artikelData = [
{
judul: "Keutamaan Sholat Berjamaah",
tanggal: "23 Februari 2026",
isi: "Sholat berjamaah memiliki keutamaan 27 derajat dibanding sholat sendiri..."
},
{
judul: "Makna Ikhlas dalam Ibadah",
tanggal: "22 Februari 2026",
isi: "Ikhlas adalah memurnikan niat hanya karena Allah SWT..."
}
];

const container = document.getElementById("artikel-list");
if(!container) return;

artikelData.forEach(post => {

let card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3 class="post-title">${post.judul}</h3>
<p class="post-meta">${post.tanggal}</p>
<p class="post-content">${post.isi.substring(0,120)}...</p>
`;

container.appendChild(card);

});

}

/* =========================
   JADWAL SHOLAT OTOMATIS
========================= */

function initJadwalSholat(){

if(!navigator.geolocation){
alert("Browser tidak mendukung geolocation");
return;
}

navigator.geolocation.getCurrentPosition(async function(position){

const lat = position.coords.latitude;
const lon = position.coords.longitude;

const todayKey = new Date().toISOString().split("T")[0];
const cache = localStorage.getItem("jadwal-"+todayKey);

let data;

if(cache){
data = JSON.parse(cache);
}else{

const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
const result = await response.json();

data = result.data;
localStorage.setItem("jadwal-"+todayKey, JSON.stringify(data));

}

renderJadwal(data.timings);
renderTanggal(data);
updateCountdown(data.timings);
setInterval(() => updateCountdown(data.timings), 1000);

}, function(){
alert("Lokasi ditolak. Tidak bisa menampilkan jadwal otomatis.");
});

}

function renderJadwal(jadwal){

document.getElementById("subuh").innerText = jadwal.Fajr;
document.getElementById("dzuhur").innerText = jadwal.Dhuhr;
document.getElementById("ashar").innerText = jadwal.Asr;
document.getElementById("maghrib").innerText = jadwal.Maghrib;
document.getElementById("isya").innerText = jadwal.Isha;

}

/* =========================
   TANGGAL
========================= */

function renderTanggal(data){

// Nasional
const now = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("tanggal-nasional").innerText =
"Tanggal: " + now.toLocaleDateString('id-ID', options);

// Hijriyah dari API
document.getElementById("tanggal-hijriyah").innerText =
"Hijriyah: " + data.date.hijri.day + " " +
data.date.hijri.month.en + " " +
data.date.hijri.year + " H";

// Jawa sederhana (weton 5 pasaran)
const pasaran = ["Legi","Pahing","Pon","Wage","Kliwon"];
const jawaIndex = Math.floor(now.getTime() / 86400000) % 5;

document.getElementById("tanggal-jawa").innerText =
"Jawa: " + pasaran[jawaIndex];

}

/* =========================
   COUNTDOWN
========================= */

function updateCountdown(jadwal){

const now = new Date();
const prayerNames = {
Fajr: "Subuh",
Dhuhr: "Dzuhur",
Asr: "Ashar",
Maghrib: "Maghrib",
Isha: "Isya"
};

let nextPrayer = null;

for(let key in jadwal){

let [hour, minute] = jadwal[key].split(":");
let prayerTime = new Date();
prayerTime.setHours(hour, minute, 0);

if(prayerTime > now){
nextPrayer = {name:key, time:prayerTime};
break;
}

}

if(!nextPrayer) return;

document.getElementById("next-prayer").innerText =
prayerNames[nextPrayer.name];

let diff = nextPrayer.time - now;

let hours = Math.floor(diff / 1000 / 60 / 60);
let minutes = Math.floor(diff / 1000 / 60) % 60;
let seconds = Math.floor(diff / 1000) % 60;

document.getElementById("countdown-timer").innerText =
hours + "j " + minutes + "m " + seconds + "d";

if(hours === 0 && minutes === 0 && seconds === 0){
document.getElementById("adzan-audio").play();
}

}
