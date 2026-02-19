document.addEventListener("DOMContentLoaded", () => {
    loadPrayerTimes();
    loadKajian();
});

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
