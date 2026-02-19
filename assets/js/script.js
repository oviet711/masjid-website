// ============================================
// KONFIGURASI
// ============================================
const CITY = "Jakarta";
const COUNTRY = "Indonesia";
const METHOD = 2; // Metode perhitungan sholat

// ============================================
// GLOBAL VARIABLE
// ============================================
let prayerTimesData = null;
let nextPrayerTime = null;
let nextPrayerName = null;

// ============================================
// AMBIL DATA JADWAL SHOLAT DARI API
// ============================================
fetch(`https://api.aladhan.com/v1/timingsByCity?city=${CITY}&country=${COUNTRY}&method=${METHOD}`)
.then(response => response.json())
.then(data => {

    prayerTimesData = data.data.timings;

    displayPrayerTimes(prayerTimesData);
    calculateNextPrayer();
    startCountdown();

})
.catch(error => {
    console.error("Gagal mengambil jadwal sholat:", error);
    document.getElementById("prayer-times").innerText =
        "Gagal memuat jadwal sholat.";
});


// ============================================
// TAMPILKAN JADWAL SHOLAT
// ============================================
function displayPrayerTimes(timings) {

    const container = document.getElementById("prayer-times");

    container.innerHTML = `
        <p>Subuh: ${timings.Fajr}</p>
        <p>Dzuhur: ${timings.Dhuhr}</p>
        <p>Ashar: ${timings.Asr}</p>
        <p>Maghrib: ${timings.Maghrib}</p>
        <p>Isya: ${timings.Isha}</p>
    `;
}


// ============================================
// HITUNG WAKTU ADZAN BERIKUTNYA
// ============================================
function calculateNextPrayer() {

    const now = new Date();
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (let prayer of prayers) {

        const timeParts = prayerTimesData[prayer].split(":");
        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        let prayerDate = new Date();
        prayerDate.setHours(hour, minute, 0, 0);

        if (prayerDate > now) {
            nextPrayerName = prayer;
            nextPrayerTime = prayerDate;
            break;
        }
    }

    // Jika sudah lewat semua waktu hari ini → ambil Subuh besok
    if (!nextPrayerTime) {

        const timeParts = prayerTimesData["Fajr"].split(":");
        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hour, minute, 0, 0);

        nextPrayerName = "Fajr";
        nextPrayerTime = tomorrow;
    }

    document.getElementById("next-prayer").innerText =
        "Menuju Adzan " + formatPrayerName(nextPrayerName);
}


// ============================================
// HITUNG MUNDUR REALTIME
// ============================================
function startCountdown() {

    setInterval(() => {

        if (!nextPrayerTime) return;

        const now = new Date();
        const diff = nextPrayerTime - now;

        if (diff <= 0) {
            playAdzan();
            calculateNextPrayer();
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("countdown-timer").innerText =
            `${hours} jam ${minutes} menit ${seconds} detik`;

    }, 1000);
}


// ============================================
// PUTAR SUARA ADZAN
// ============================================
function playAdzan() {

    const audio = document.getElementById("adzan-audio");

    if (audio) {
        audio.play().catch(err => {
            console.warn("Autoplay diblokir browser. User perlu interaksi.");
        });
    }
}


// ============================================
// FORMAT NAMA SHOLAT
// ============================================
function formatPrayerName(name) {

    const mapping = {
        Fajr: "Subuh",
        Dhuhr: "Dzuhur",
        Asr: "Ashar",
        Maghrib: "Maghrib",
        Isha: "Isya"
    };

    return mapping[name] || name;
}


// ============================================
// SISTEM JADWAL PENGAJIAN (LOCAL STORAGE)
// ============================================
function loadKajian() {

    const kajianList = document.getElementById("kajian-list");

    if (!kajianList) return;

    let kajian = JSON.parse(localStorage.getItem("kajian")) || [];

    if (kajian.length === 0) {

        kajianList.innerHTML = `
            <li>Senin - Tafsir Al-Qur'an (19:30 WIB)</li>
            <li>Rabu - Fiqih Ibadah (19:30 WIB)</li>
            <li>Jumat - Kajian Hadits (18:30 WIB)</li>
        `;

        return;
    }

    kajianList.innerHTML = "";

    kajian.forEach(item => {

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.hari}</strong> - 
            ${item.tema} (${item.waktu})
        `;

        kajianList.appendChild(li);
    });
}


// ============================================
// INISIALISASI SAAT HALAMAN LOAD
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    loadKajian();
});
