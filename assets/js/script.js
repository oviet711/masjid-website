document.addEventListener("DOMContentLoaded", function () {

initArtikel();
initJadwalSholatSafe();

});

/* =========================
   ARTIKEL (STABIL)
========================= */

function initArtikel(){

const artikelData = [
{
judul:"Keutamaan Sholat Berjamaah",
tanggal:"23 Februari 2026",
isi:"Sholat berjamaah memiliki keutamaan 27 derajat dibanding sholat sendiri dan mempererat ukhuwah islamiyah antar sesama muslim."
},
{
judul:"Makna Ikhlas dalam Ibadah",
tanggal:"22 Februari 2026",
isi:"Ikhlas adalah memurnikan niat hanya karena Allah SWT dalam setiap amal ibadah agar diterima dan bernilai pahala."
}
];

const container = document.getElementById("artikel-list");
if(!container) return;

container.innerHTML = "";

artikelData.forEach(post => {

let card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<h3 class="post-title">${post.judul}</h3>
<p class="post-meta">${post.tanggal}</p>
<p class="post-content">${post.isi}</p>
`;

container.appendChild(card);

});

}

/* =========================
   JADWAL SHOLAT SAFE MODE
========================= */

function initJadwalSholatSafe(){

if(!navigator.geolocation){
useDefaultLocation();
return;
}

navigator.geolocation.getCurrentPosition(
position => {
fetchJadwal(position.coords.latitude, position.coords.longitude);
},
error => {
console.log("Lokasi ditolak, pakai default Jakarta");
useDefaultLocation();
}
);

}

function useDefaultLocation(){
// Jakarta fallback
fetchJadwal(-6.200000,106.816666);
}

async function fetchJadwal(lat, lon){

try{

const todayKey = new Date().toISOString().split("T")[0];
const cacheKey = "jadwal-"+todayKey;
const cache = localStorage.getItem(cacheKey);

let data;

if(cache){
data = JSON.parse(cache);
}else{

const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
const result = await response.json();

if(!result || !result.data) throw "API Error";

data = result.data;
localStorage.setItem(cacheKey, JSON.stringify(data));

}

renderJadwal(data.timings);
renderTanggal(data);
startCountdown(data.timings);

}catch(err){
console.log("Gagal ambil jadwal:",err);
}

}

/* =========================
   RENDER JADWAL
========================= */

function renderJadwal(j){

if(!j) return;

document.getElementById("subuh").innerText = j.Fajr || "-";
document.getElementById("dzuhur").innerText = j.Dhuhr || "-";
document.getElementById("ashar").innerText = j.Asr || "-";
document.getElementById("maghrib").innerText = j.Maghrib || "-";
document.getElementById("isya").innerText = j.Isha || "-";

}

/* =========================
   RENDER TANGGAL (SAFE)
========================= */

function renderTanggal(data){

const now = new Date();

const nasional = now.toLocaleDateString("id-ID",{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
});

document.getElementById("tanggal-nasional").innerText =
"Tanggal: "+nasional;

if(data && data.date && data.date.hijri){

document.getElementById("tanggal-hijriyah").innerText =
"Hijriyah: "+
data.date.hijri.day+" "+
data.date.hijri.month.en+" "+
data.date.hijri.year+" H";

}

// Jawa (simple rotation)
const pasaran=["Legi","Pahing","Pon","Wage","Kliwon"];
const jawaIndex=Math.floor(now.getTime()/86400000)%5;

document.getElementById("tanggal-jawa").innerText =
"Jawa: "+pasaran[jawaIndex];

}

/* =========================
   COUNTDOWN
========================= */

function startCountdown(jadwal){

setInterval(()=>{

const now=new Date();
let next=null;

for(let key of ["Fajr","Dhuhr","Asr","Maghrib","Isha"]){

let [h,m]=jadwal[key].split(":");
let time=new Date();
time.setHours(h,m,0);

if(time>now){
next={name:key,time:time};
break;
}

}

if(!next) return;

document.getElementById("next-prayer").innerText=next.name;

let diff=next.time-now;

let hours=Math.floor(diff/1000/60/60);
let minutes=Math.floor(diff/1000/60)%60;
let seconds=Math.floor(diff/1000)%60;

document.getElementById("countdown-timer").innerText=
hours+"j "+minutes+"m "+seconds+"d";

},1000);

}

/* =========================
   KALENDER BULANAN
========================= */

generateCalendar();

async function generateCalendar(){

const grid = document.getElementById("calendar-grid");
const header = document.getElementById("calendar-header");
if(!grid) return;

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

header.innerText =
now.toLocaleDateString("id-ID",{month:"long",year:"numeric"});

grid.innerHTML="";

// Hari
const days=["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
days.forEach(d=>{
let el=document.createElement("div");
el.className="calendar-day-name";
el.innerText=d;
grid.appendChild(el);
});

const firstDay=new Date(year,month,1).getDay();
const totalDays=new Date(year,month+1,0).getDate();

// offset
for(let i=0;i<firstDay;i++){
grid.appendChild(document.createElement("div"));
}

for(let day=1;day<=totalDays;day++){

let dateObj=new Date(year,month,day);
let cell=document.createElement("div");
cell.className="calendar-cell";

// Highlight hari ini
if(
day===now.getDate() &&
month===now.getMonth() &&
year===now.getFullYear()
){
cell.classList.add("today");
}

// ===================
// HIJRIYAH (Native)
// ===================
let hijri = new Intl.DateTimeFormat("ar-TN-u-ca-islamic",{
day:"numeric",
month:"long"
}).format(dateObj);

// ===================
// JAWA (WETON AKURAT)
// ===================
const pasaran=["Legi","Pahing","Pon","Wage","Kliwon"];
const reference=new Date(1970,0,1);
const diffDays=Math.floor((dateObj-reference)/86400000);
const jawaIndex=(diffDays+4)%5; 
// +4 untuk sinkronisasi epoch umum weton

let jawa=pasaran[(jawaIndex+5)%5];

// ===================
// CINA LUNAR
// ===================
let china = new Intl.DateTimeFormat("zh-CN-u-ca-chinese",{
day:"numeric",
month:"long"
}).format(dateObj);

// ===================
// RENDER
// ===================

cell.innerHTML=`
<div class="calendar-main">${day}</div>
<div class="calendar-sub">
Hijriyah: ${hijri}<br>
Jawa: ${jawa}<br>
Cina: ${china}
</div>
`;

grid.appendChild(cell);

}




