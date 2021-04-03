"use strict";

let monthsList = [
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
let busyDates = [today];
localStorage.setItem("busyDatesArray", JSON.stringify(busyDates));

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

window.addEventListener("load", displayCalendar(currentMonth, currentYear));

let previousMonthButton = document.getElementById("previousMonth");
previousMonthButton.addEventListener("click", showPreviousMonth);

let nextMonthButton = document.getElementById("nextMonth");
nextMonthButton.addEventListener("click", showNextMonth);

let blackoutStartDate = document.createElement("input");
blackoutStartDate.setAttribute("type", "date");
blackoutStartDate.setAttribute("id", "startDate");

let blackoutEndDate = document.createElement("input");
blackoutEndDate.setAttribute("type", "date");
blackoutEndDate.setAttribute("id", "endDate");

let blockDatesButton = document.createElement("input");
blockDatesButton.setAttribute("type", "submit");
blockDatesButton.setAttribute("value", "Set Busy Dates");
blockDatesButton.addEventListener("click", addBusyDates);

let removeBusyDatesButton = document.createElement("input");
removeBusyDatesButton.setAttribute("type", "submit");
removeBusyDatesButton.setAttribute("value", "Remove Busy Dates");
removeBusyDatesButton.addEventListener("click", removeBusyDates);

let blackoutEntryRow = document.getElementById("blackoutEntry");
blackoutEntryRow.appendChild(blackoutStartDate);
blackoutEntryRow.appendChild(blackoutEndDate);
blackoutEntryRow.appendChild(blockDatesButton);
blackoutEntryRow.appendChild(removeBusyDatesButton);

function displayCalendar(month, year) {
  setCalendarMonth(month, year);
  setCalendarDays(month, year);
  setAllBusyDates();
}

function setCalendarMonth(month, year) {
  let calendarHeading = document.getElementById("monthYear");
  calendarHeading.innerHTML = "";
  calendarHeading.setAttribute("colspan", "5");
  let text = document.createTextNode(`${monthsList[month]} ${year}`);
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
        day.setAttribute("id", "daysOfMonth");
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

function addBusyDates(event) {
  event.preventDefault();

  let startEntry = document.getElementById("startDate");
  let startBusyDate = new Date(startEntry.value + "T00:00");

  let endEntry = document.getElementById("endDate");
  let endBusyDate = new Date(endEntry.value + "T00:00");

  let days = document.querySelectorAll("#daysOfMonth");

  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let dateInQuestion = new Date(currentYear, currentMonth, day);
    if (dateInQuestion >= startBusyDate && dateInQuestion <= endBusyDate) {
      days[i].setAttribute("class", "busy");
      busyDates.push(dateInQuestion.toUTCString());
    }
  }
  updateBusyDates(busyDates);
  startEntry.value = "";
  endEntry.value = "";
}

function saveBusyDates(array) {
  localStorage.setItem("busyDatesArray", JSON.stringify(array));
}

function updateBusyDates(array) {
  let updatedBusyDatesArray = getBusyDates();
  let newArray = updatedBusyDatesArray.concat(array);
  saveBusyDates(newArray);
}

function getBusyDates() {
  let retrievedData = localStorage.getItem("busyDatesArray");
  let retrievedBusyDatesArray = JSON.parse(retrievedData);
  return retrievedBusyDatesArray;
}

function removeBusyDates(event) {
  event.preventDefault();

  let allBusyDates = getBusyDates();

  let startEntry = document.getElementById("startDate");
  let startDateRemoval = new Date(startEntry.value + "T00:00");

  let endEntry = document.getElementById("endDate");
  let endDateRemoval = new Date(endEntry.value + "T00:00");

  let days = document.querySelectorAll("#daysOfMonth");
  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let dateInQuestion = new Date(currentYear, currentMonth, day);
    if (
      dateInQuestion >= startDateRemoval &&
      dateInQuestion <= endDateRemoval
    ) {
      days[i].removeAttribute("class");
      for (let x = 0; x < allBusyDates.length; x++) {
        let dateToCompare = new Date(allBusyDates[x]);
        if (dateInQuestion.getTime() == dateToCompare.getTime()) {
          allBusyDates.splice(x, 1);
          saveBusyDates(allBusyDates);
        }
      }
    }
  }
  startEntry.value = "";
  endEntry.value = "";
}

function setAllBusyDates() {
  let allBusyDates = getBusyDates();
  let days = document.querySelectorAll("#daysOfMonth");

  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let date1 = new Date(currentYear, currentMonth, day);
    for (let x = 0; x < allBusyDates.length; x++) {
      let date2 = new Date(allBusyDates[x]);
      if (date1.getTime() == date2.getTime())
        days[i].setAttribute("className", "busy");
    }
  }
}
