fetch(`https://api.aladhan.com/v1/timingsByCity?city=${CONFIG.city}&country=${CONFIG.country}&method=${CONFIG.method}`)
.then(res=>res.json())
.then(data=>{
  const t = data.data.timings;
  document.getElementById("prayerTimes").innerHTML = `
    Subuh: ${t.Fajr}<br>
    Dzuhur: ${t.Dhuhr}<br>
    Ashar: ${t.Asr}<br>
    Maghrib: ${t.Maghrib}<br>
    Isya: ${t.Isha}
  `;
});