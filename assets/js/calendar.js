const calendarEl = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
let currentDate = new Date();

function renderCalendar(date) {
  calendarEl.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  monthTitle.innerText = date.toLocaleString("id-ID",{month:"long",year:"numeric"});

  const lastDate = new Date(year, month+1, 0).getDate();

  for (let day=1; day<=lastDate; day++) {
    let d = new Date(year,month,day);
    calendarEl.innerHTML += `
      <div class="calendar-day">
        <div class="cell masehi">${day}</div>
        <div class="cell jawa">${getJawaDay(d)}</div>
        <div class="cell hijri">${getHijriDate(d)}</div>
        <div class="cell cina">${getChineseZodiac(year)}</div>
      </div>
    `;
  }
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth()-1);
  renderCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth()+1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);