document.addEventListener("DOMContentLoaded", () => {
loadPrayerTimes();
loadKajian();
loadArtikel();
});

// =======================
// JADWAL SHOLAT
// =======================
async function loadPrayerTimes(){

try{

const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=11");
const data = await res.json();
const t = data.data.timings;

document.getElementById("subuh").innerText = clean(t.Fajr);
document.getElementById("dzuhur").innerText = clean(t.Dhuhr);
document.getElementById("ashar").innerText = clean(t.Asr);
document.getElementById("maghrib").innerText = clean(t.Maghrib);
document.getElementById("isya").innerText = clean(t.Isha);

startCountdown(t);

}
catch(e){
console.log("Error Jadwal");
}

}

function clean(time){
return time.split(" ")[0];
}

function startCountdown(times){

const list=["Fajr","Dhuhr","Asr","Maghrib","Isha"];

let nextTime=null;
let nextPrayer="";

function setNext(){

let now=new Date();

for(let p of list){

let [h,m]=clean(times[p]).split(":");

let t=new Date();
t.setHours(parseInt(h),parseInt(m),0);

if(t>now){
nextTime=t;
nextPrayer=p;
break;
}

}

if(!nextTime){

let [h,m]=clean(times["Fajr"]).split(":");
nextPrayer="Fajr";

nextTime=new Date();
nextTime.setDate(nextTime.getDate()+1);
nextTime.setHours(parseInt(h),parseInt(m),0);

}

document.getElementById("next-prayer").innerText=nextPrayer;

}

setNext();

let played=false;

setInterval(()=>{

let diff=nextTime-new Date();

let h=Math.floor(diff/1000/60/60);
let m=Math.floor(diff/1000/60)%60;
let s=Math.floor(diff/1000)%60;

document.getElementById("countdown-timer").innerText=
`${h}j ${m}m ${s}d`;

if(diff<=0 && !played){
document.getElementById("adzan-audio").play();
played=true;
setTimeout(()=>location.reload(),60000);
}

},1000);

}

// =======================
// KAJIAN
// =======================
function loadKajian(){

const list=document.getElementById("kajian-list");

const kajian=[
{judul:"Tafsir Al-Qur'an",ustadz:"Ustadz Ahmad"},
{judul:"Fiqih Sholat",ustadz:"Ustadz Yusuf"},
{judul:"Akhlak Muslim",ustadz:"Ustadz Rahman"}
];

kajian.forEach(k=>{

list.innerHTML+=`
<div class="post-card">
<h3>${k.judul}</h3>
<p>Pemateri: ${k.ustadz}</p>
</div>
`;

});

}

// =======================
// ARTIKEL
// =======================
function loadArtikel(){

fetch('/masjid-website/data/articles.json')
.then(res=>res.json())
.then(data=>{

const c=document.getElementById("artikel-list");
c.innerHTML="";

data.forEach((a,i)=>{

let short=a.isi.substring(0,120);

c.innerHTML+=`
<div class="post-card">
<h3>${a.judul}</h3>
<p>${short}...</p>
<a href="post.html?id=${i}" class="read-btn">Selengkapnya</a>
</div>
`;

});

});

}
