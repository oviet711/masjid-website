var map = L.map('map').setView([-6.1425, 106.7415], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19
}).addTo(map);

L.marker([-6.1425, 106.7415])
.addTo(map)
.bindPopup('Al-Muttaqin Mosque')
.openPopup();

var mapsUrl = "https://www.google.com/maps/search/?api=1&query=Al-Muttaqin+Mosque+Kapuk+Cengkareng+Jakarta";

new QRCode(document.getElementById("qrcode"),{
  text: mapsUrl,
  width:150,
  height:150
});