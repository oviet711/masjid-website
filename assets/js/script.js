document.addEventListener("DOMContentLoaded", function () {

const artikelData = [
{
judul: "Keutamaan Sholat Berjamaah",
tanggal: "23 Februari 2026",
isi: "Sholat berjamaah memiliki keutamaan 27 derajat dibanding sholat sendiri. Selain pahala yang berlipat, sholat berjamaah juga mempererat ukhuwah islamiyah antar sesama muslim..."
},
{
judul: "Makna Ikhlas dalam Ibadah",
tanggal: "22 Februari 2026",
isi: "Ikhlas adalah memurnikan niat hanya karena Allah SWT. Tanpa keikhlasan, amal ibadah tidak bernilai di sisi-Nya. Oleh karena itu setiap muslim harus senantiasa memperbaiki niatnya..."
},
{
judul: "Keutamaan Membaca Al-Qur'an",
tanggal: "21 Februari 2026",
isi: "Membaca Al-Qur'an merupakan ibadah yang sangat dianjurkan. Setiap huruf yang dibaca akan mendapatkan sepuluh kebaikan. Selain itu Al-Qur'an menjadi penenang hati dan petunjuk hidup..."
}
];

const artikelContainer = document.getElementById("artikel-list");

artikelData.forEach(function(post){

let card = document.createElement("div");
card.classList.add("card");

let title = document.createElement("h3");
title.classList.add("post-title");
title.innerText = post.judul;

let meta = document.createElement("p");
meta.classList.add("post-meta");
meta.innerText = post.tanggal;

let content = document.createElement("p");
content.classList.add("post-content");

let fullText = post.isi;
let shortText = fullText.substring(0,120) + "...";

content.innerText = shortText;

let btn = document.createElement("button");
btn.innerText = "Selengkapnya";
btn.classList.add("read-btn");

btn.onclick = function(){
if(content.innerText === shortText){
content.innerText = fullText;
btn.innerText = "Tutup";
}else{
content.innerText = shortText;
btn.innerText = "Selengkapnya";
}
}

card.appendChild(title);
card.appendChild(meta);
card.appendChild(content);
card.appendChild(btn);

artikelContainer.appendChild(card);

});

});
