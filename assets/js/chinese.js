function getChineseZodiac(year) {
  const shio = ["Monyet","Ayam","Anjing","Babi","Tikus","Kerbau","Macan","Kelinci","Naga","Ular","Kuda","Kambing"];
  return shio[year % 12];
}