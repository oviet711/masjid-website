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
isi: "Sholat berjamaah memiliki keutamaan 27 derajat dibanding sholat sendiri. Selain pahala berlipat, sholat berjamaah juga mempererat ukhuwah antar sesama muslim dan menjadi simbol persatuan umat Islam."
},
{
judul: "Makna Ikhlas dalam Ibadah",
tanggal: "22 Februari 2026",
isi: "Ikhlas adalah memurnikan niat hanya karena Allah SWT. Tanpa keikhlasan, amal tidak bernilai. Seorang muslim harus senantiasa memperbaiki niatnya dalam setiap ibadah."
},
{
judul: "Keutamaan Membaca Al-Qur'an",
tanggal: "21 Februari 2026",
isi: "Setiap huruf yang dibaca dari Al-Qur'an akan mendapat sepuluh kebaikan. Selain pahala, Al-Qur'an adalah petunjuk hidup dan penenang hati bagi orang-orang beriman."
}
];

const container = document.getElementById("artikel-list");
if(!container) return;

artikelData.forEach(post => {

let card = document.createElement("div");
card.className = "card";

let title = document.createElement("h3");
title.className = "post-title";
title.innerText = post.judul;

let meta = document.createElement("p");
meta.className = "post-meta";
meta.innerText = post.tanggal;

let content = document.createElement("p");
content.className = "post-content";

let fullText = post.isi;
let shortText = fullText.substring(0,120) + "...";

content.innerText = shortText;

let btn = document.createElement("button");
btn.className = "read-btn";
btn.innerText = "Selengkapnya";

btn.addEventListener("click", function(){
if(content.innerText === shortText){
content.innerText = fullText;
btn.innerText = "Tutup";
}else{
content.innerText = shortText;
btn.innerText = "Selengkapnya";
}
});

card.appendChild(title);
card.appendChild(meta);
card.appendChild(content);
card.appendChild(btn);

container.appendChild(card);

});

}

/* =========================
   JADWAL SHOLAT + COUNTDOWN
========================= */

function initJadwalSholat(){

const jadwal = {
subuh: "04:45",
dzuhur: "12:05",
ashar: "15:20",
maghrib: "18:15",
isya: "19:30"
};

document.getElementById("subuh").innerText = jadwal.subuh;
document.getElementById("dzuhur").innerText = jadwal.dzuhur;
document.getElementById("ashar").innerText = jadwal.ashar;
document.getElementById("maghrib").innerText = jadwal.maghrib;
document.getElementById("isya").innerText = jadwal.isya;

updateCountdown(jadwal);
setInterval(() => updateCountdown(jadwal), 1000);

}

function updateCountdown(jadwal){

const now = new Date();
const times = [];

for(let key in jadwal){
let [hour, minute] = jadwal[key].split(":");
let prayerTime = new Date();
prayerTime.setHours(hour, minute, 0);

if(prayerTime > now){
times.push({name:key, time:prayerTime});
}
}

if(times.length === 0){
return;
}

const next = times[0];

document.getElementById("next-prayer").innerText = next.name;

let diff = next.time - now;

let hours = Math.floor(diff / 1000 / 60 / 60);
let minutes = Math.floor(diff / 1000 / 60) % 60;
let seconds = Math.floor(diff / 1000) % 60;

document.getElementById("countdown-timer").innerText =
hours + "j " + minutes + "m " + seconds + "d";

if(hours === 0 && minutes === 0 && seconds === 0){
document.getElementById("adzan-audio").play();
}

}
