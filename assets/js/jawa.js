function getJawaDay(date) {
  const pasaran = ["Legi","Pahing","Pon","Wage","Kliwon"];
  return pasaran[date.getDate() % 5];
}