"use strict";

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

window.addEventListener("load", displayCalendar(currentMonth, currentYear));

let previousMonthButton = document.getElementById("previousMonth");
previousMonthButton.addEventListener("click", showPreviousMonth);

let nextMonthButton = document.getElementById("nextMonth");
nextMonthButton.addEventListener("click", showNextMonth);

function displayCalendar(month, year) {
  setCalendarMonth(month, year);
  setCalendarDays(month, year);
}

function setCalendarMonth(month, year) {
  let calendarHeading = document.getElementById("monthYear");
  calendarHeading.innerHTML = "";
  calendarHeading.setAttribute("colspan", "5");
  let text = document.createTextNode(`${months[month]} ${year}`);
  calendarHeading.appendChild(text);
}

function setCalendarDays(month, year) {
  const MAX_ROWS = 6;
  const MAX_DAYS = 7;

  let newCalendar = new Date(year, month);
  let weekdayStart = newCalendar.getDay();
  let calendarBody = document.getElementById("calendarBody");

  calendarBody.innerHTML = "";

  let dayCount = 1;

  for (let row = 0; row < MAX_ROWS; row++) {
    let week = document.createElement("tr");

    for (let cell = 0; cell < MAX_DAYS; cell++) {
      if (row == 0 && cell < weekdayStart) {
        let day = document.createElement("td");
        let dayLabel = document.createTextNode(" ");
        day.appendChild(dayLabel);
        week.appendChild(day);
      } else if (dayCount > numberOfDaysInMonth(month, year)) {
        break;
      } else {
        let day = document.createElement("td");
        let dayLabel = document.createTextNode(dayCount);
        day.appendChild(dayLabel);
        week.appendChild(day);
        dayCount++;
      }
    }
    calendarBody.appendChild(week);
  }
}

function numberOfDaysInMonth(month, year) {
  return 32 - new Date(year, month, 32).getDate();
}

function showPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  displayCalendar(currentMonth, currentYear);
}

function showNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  displayCalendar(currentMonth, currentYear);
}

function showSelectedMonth() {
  let formDateSelected = document.getElementById("date");
  let monthSelected = formDateSelected.valueAsDate.getUTCMonth();
  let yearSelected = formDateSelected.valueAsDate.getUTCFullYear();
  displayCalendar(monthSelected, yearSelected);
}
