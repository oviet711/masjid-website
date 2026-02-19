document.addEventListener("DOMContentLoaded", () => {
    loadPrayerTimes();
    loadKajian();
});

async function getPrayerTimes() {

let city = "Jakarta";

let url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`;

let res = await fetch(url);
let data = await res.json();
let t = data.data.timings;

document.getElementById("subuh").innerText = t.Fajr;
document.getElementById("dzuhur").innerText = t.Dhuhr;
document.getElementById("ashar").innerText = t.Asr;
document.getElementById("maghrib").innerText = t.Maghrib;
document.getElementById("isya").innerText = t.Isha;

countdownAdzan(t);
}

function countdownAdzan(t){
let now = new Date();

let target = new Date();
let [h,m] = t.Maghrib.split(":");

target.setHours(h);
target.setMinutes(m);
target.setSeconds(0);

let diff = target - now;

setInterval(()=>{
diff -= 1000;

let min = Math.floor(diff/60000);
let sec = Math.floor((diff%60000)/1000);

document.getElementById("countdown")
.innerText = `${min}:${sec}`;

if(diff<=0){
document.getElementById("adzan-audio").play();
}
},1000);
}

getPrayerTimes();


async function loadPrayerTimes(){
    try{
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2");
        const data = await res.json();

        const times = data.data.timings;

        const prayerHTML = `
            Subuh: ${times.Fajr}<br>
            Dzuhur: ${times.Dhuhr}<br>
            Ashar: ${times.Asr}<br>
            Maghrib: ${times.Maghrib}<br>
            Isya: ${times.Isha}
        `;

        document.getElementById("prayer-times").innerHTML = prayerHTML;

        startCountdown(times);

    }catch(err){
        document.getElementById("prayer-times").innerHTML="Gagal memuat jadwal.";
    }
}

function startCountdown(times){
    const now = new Date();
    const prayerList = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

    let nextPrayer = null;
    let nextTime = null;

    for(let p of prayerList){
        let [h,m] = times[p].split(":");
        let prayerDate = new Date();
        prayerDate.setHours(h,m,0);

        if(prayerDate > now){
            nextPrayer = p;
            nextTime = prayerDate;
            break;
        }
    }

    if(!nextPrayer){
        nextPrayer="Fajr";
        let [h,m]=times["Fajr"].split(":");
        nextTime=new Date();
        nextTime.setDate(nextTime.getDate()+1);
        nextTime.setHours(h,m,0);
    }

    document.getElementById("next-prayer").innerText=nextPrayer;

    setInterval(()=>{
        let diff = nextTime - new Date();
        let hours = Math.floor(diff/1000/60/60);
        let minutes = Math.floor(diff/1000/60)%60;
        let seconds = Math.floor(diff/1000)%60;

        document.getElementById("countdown-timer").innerText=
            `${hours}j ${minutes}m ${seconds}d`;
    },1000);
}

function loadKajian(){
    const list = document.getElementById("kajian-list");
    const kajian = [
        {judul:"Tafsir Al-Quran", ustadz:"Ustadz Ahmad"},
        {judul:"Fiqih Sholat", ustadz:"Ustadz Yusuf"},
        {judul:"Akhlak Muslim", ustadz:"Ustadz Rahman"}
    ];

    kajian.forEach(k=>{
        list.innerHTML += `
            <div class="card">
                <h3>${k.judul}</h3>
                <p>Pemateri: ${k.ustadz}</p>
            </div>
        `;
    });
}

