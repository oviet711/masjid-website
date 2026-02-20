document.addEventListener("DOMContentLoaded", () => {
    loadPrayerTimes();
    loadKajian();
});

// ================================
// AMBIL JADWAL SHOLAT OTOMATIS
// ================================
async function loadPrayerTimes(){

try{

const city = "Jakarta";

const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`);
const data = await res.json();
const t = data.data.timings;

// tampilkan jadwal
document.getElementById("subuh").innerText = t.Fajr;
document.getElementById("dzuhur").innerText = t.Dhuhr;
document.getElementById("ashar").innerText = t.Asr;
document.getElementById("maghrib").innerText = t.Maghrib;
document.getElementById("isya").innerText = t.Isha;

// jalankan countdown
startCountdown(t);

}
catch(e){
console.log("Gagal ambil jadwal");
}

}

// ================================
// HITUNG SHOLAT BERIKUTNYA
// ================================
function startCountdown(times){

const prayerList = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

let nextPrayer = "";
let nextTime = null;

function cleanTime(timeStr){
return timeStr.split(" ")[0]; // hapus (+07)
}

function updateNextPrayer(){

const now = new Date();

for(let p of prayerList){

let time = cleanTime(times[p]);

let [h,m] = time.split(":");

let prayerDate = new Date();

prayerDate.setHours(parseInt(h),parseInt(m),0);

if(prayerDate > now){
nextPrayer = p;
nextTime = prayerDate;
break;
}

}

// jika sudah lewat semua → subuh besok
if(!nextTime){

let time = cleanTime(times["Fajr"]);
let [h,m] = time.split(":");

nextPrayer = "Fajr";

nextTime = new Date();
nextTime.setDate(nextTime.getDate()+1);
nextTime.setHours(parseInt(h),parseInt(m),0);

}

document.getElementById("next-prayer").innerText = nextPrayer;

}

updateNextPrayer();

// ================================
// COUNTDOWN REALTIME
// ================================
let adzanPlayed = false;

setInterval(()=>{

if(!nextTime) return;

let diff = nextTime - new Date();

if(diff < 0) diff = 0;

let h = Math.floor(diff/1000/60/60);
let m = Math.floor(diff/1000/60)%60;
let s = Math.floor(diff/1000)%60;

document.getElementById("countdown-timer").innerText =
`${h}j ${m}m ${s}d`;

// bunyi adzan sekali saja
if(diff === 0 && !adzanPlayed){
document.getElementById("adzan-audio").play();
adzanPlayed = true;
setTimeout(()=>location.reload(),60000);
}

},1000);

}

// ================================
// DATA KAJIAN MASJID
// ================================
function loadKajian(){

const list = document.getElementById("kajian-list");

const kajian = [
{judul:"Tafsir Al-Qur'an", ustadz:"Ustadz Ahmad"},
{judul:"Fiqih Sholat", ustadz:"Ustadz Yusuf"},
{judul:"Akhlak Muslim", ustadz:"Ustadz Rahman"}
];

kajian.forEach((article,index) => {

let shortText = article.isi.substring(0,120);

container.innerHTML += `
<div class="post-card">

<h3>${article.judul}</h3>

<p id="short-${index}">
${shortText}...
</p>

<p id="full-${index}" style="display:none;">
${article.isi}
</p>

<button onclick="toggleRead(${index})"
class="read-btn"
id="btn-${index}">
Selengkapnya
</button>

</div>
`;
});


}


