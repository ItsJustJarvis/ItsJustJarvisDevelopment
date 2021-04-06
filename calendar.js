/*
Name:   Reeve Jarvis
Course: DGL-113
Section: DLU1
Assignment: Course Project
Update Date: 04/04/2021

Filename:   calendar.js

Javascript functionality for my Contact Page, including dynamic calendar creation and admin date scheduling.
*/

"use strict";

//Declare names of months to use for presentation in accordance with index values
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

//Initialize a date object, and other variables to represent the current day/month/year.
let today = new Date();
today.setHours(0, 0, 0, 0);
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const MAX_WEEKS = 6;
const MAX_DAYS = 7;

//Initialize an array to contain busy dates, set initial contents to include today (no same day bookings
//without special request)
let busyDates = [today];

//On loading page, display calendar with current month/year
window.addEventListener("load", displayCalendar(currentMonth, currentYear));

//Get ahold of the calendar navigation button for the previous month and set event listener
let previousMonthButton = document.getElementById("previousMonth");
previousMonthButton.addEventListener("click", showPreviousMonth);

//Get ahold of the calendar navigation button for the next month and set event listener
let nextMonthButton = document.getElementById("nextMonth");
nextMonthButton.addEventListener("click", showNextMonth);

//Create button to submit new busy dates, set attributes and event listener
let setBusyDatesButton = document.createElement("input");
setBusyDatesButton.setAttribute("type", "submit");
setBusyDatesButton.setAttribute("value", "Set Busy Dates");
setBusyDatesButton.addEventListener("click", addBusyDates);

//Create button to remove busy dates from schedule, set attributes and event listener
let removeBusyDatesButton = document.createElement("input");
removeBusyDatesButton.setAttribute("type", "submit");
removeBusyDatesButton.setAttribute("value", "Remove Busy Dates");
removeBusyDatesButton.addEventListener("click", removeBusyDates);

//Get ahold of container for scheduling form, append previously created submit buttons to it
let scheduleEntryRow = document.getElementById("blackoutEntry");
scheduleEntryRow.appendChild(setBusyDatesButton);
scheduleEntryRow.appendChild(removeBusyDatesButton);

//Get ahold of request form date entry to allow cross-calendar response, set event listener to respond to changes
let requestDate = document.getElementById("date");
requestDate.addEventListener("change", showSelectedMonth);

//Display calendar, initated on load among other places. Calls functions to set month, date, and busy dates in schedule
function displayCalendar(month, year) {
  setCalendarMonth(month, year);
  setCalendarDays(month, year);
  setAllBusyDates();
}

//Set the heading of the calendar to represent the current month and year, filling with dynamic information
function setCalendarMonth(month, year) {
  let calendarHeading = document.getElementById("monthYear");
  calendarHeading.innerHTML = "";
  let text = document.createTextNode(`${monthsList[month]} ${year}`);
  calendarHeading.appendChild(text);
}

//Dynamically create calendar table and set the days of the calendar month, removing and refreshing the values
//on a month change. Implemented using ideas from course assignments and techniques found in research.
//Adjusted to fit my needs and react to busy date scheduling functionality.
function setCalendarDays(month, year) {
  let newCalendar = new Date(year, month);
  let weekdayStart = newCalendar.getDay();
  let calendarBody = document.getElementById("calendarBody");
  let dayCount = 1;

  calendarBody.innerHTML = "";

  for (let row = 0; row < MAX_WEEKS; row++) {
    let week = document.createElement("tr");
    week.classList.add("weeks");
    for (let cell = 0; cell < MAX_DAYS; cell++) {
      if (row == 0 && cell < weekdayStart) {
        let day = document.createElement("td");
        let dayLabel = document.createTextNode(" ");
        day.appendChild(dayLabel);
        day.classList.add("lastMonth");
        week.appendChild(day);
      } else {
        let day = document.createElement("td");
        day.classList.add("daysOfMonth");
        let dayLabel = document.createTextNode(dayCount);
        day.appendChild(dayLabel);
        week.appendChild(day);
        dayCount++;
      }
    }
    calendarBody.appendChild(week);
  }
  removeUnwantedDates();
}

function removeUnwantedDates() {
  let allDays = document.querySelectorAll(".daysOfMonth");
  for (let i = 0; i < allDays.length; i++) {
    if (
      Number.parseInt(allDays[i].innerHTML) >
      numberOfDaysInMonth(currentMonth, currentYear)
    ) {
      allDays[i].style.display = "none";
    }
  }
}

//Function to get an accurate number of days in month by using technique found in research
// on stack overflow. Setting the date to larger value than possible resets to the last day.
function numberOfDaysInMonth(month, year) {
  return 32 - new Date(year, month, 32).getDate();
}

//Event handler for previous month button press, adjusting the value of the current month and
//reacting to possible year change then displaying new calendar
function showPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  displayCalendar(currentMonth, currentYear);
}

//Event handler for next month button press, adjusting the value of the current month and
//reacting to possible year change then displaying new calendar
function showNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  displayCalendar(currentMonth, currentYear);
}

//Cross-calendar reaction to request-form date selection, showing the month and year selected
//as well as highlighting the day to check availability
function showSelectedMonth() {
  let daySelected = requestDate.valueAsDate.getUTCDate();
  let monthSelected = requestDate.valueAsDate.getMonth();
  let yearSelected = requestDate.valueAsDate.getFullYear();
  currentMonth = monthSelected;
  currentYear = yearSelected;
  displayCalendar(currentMonth, currentYear);
  setSelectedDay(daySelected);
  requestDate.value = "";
}

//Function to highlight the date selected in the request-form
function setSelectedDay(selectedDay) {
  let allDays = document.querySelectorAll(".daysOfMonth");
  for (let i = 0; i < allDays.length; i++) {
    if (selectedDay == allDays[i].innerHTML)
      allDays[i].classList.add("selected");
  }
}

//Event handler to add busy dates to the calendar schedule, blocking them out and adding them to
// the array/local storage to remain persistent. This implementation using local storage is purely
//to display functionality as github only allows static websites. To be adjusted when website is
//hosted elsewhere.
function addBusyDates(event) {
  event.preventDefault();

  let startEntry = document.getElementById("startDate");
  let startBusyDate = new Date(startEntry.value + "T00:00");

  let endEntry = document.getElementById("endDate");
  let endBusyDate = new Date(endEntry.value + "T00:00");

  let days = document.querySelectorAll(".daysOfMonth");

  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let dateInQuestion = new Date(currentYear, currentMonth, day);
    if (dateInQuestion >= startBusyDate && dateInQuestion <= endBusyDate) {
      days[i].classList.add("busy");
      busyDates.push(dateInQuestion.toUTCString());
    }
  }
  updateBusyDates(busyDates);
  startEntry.value = "";
  endEntry.value = "";
}

//Function to save the busy dates into the local storage and maintain running list using JSON
function saveBusyDates(array) {
  localStorage.setItem("busyDatesArray", JSON.stringify(array));
}

//Function to update/concatenate busy date arrays as necessary to maintain running list
//and then save to local storage using JSON
function updateBusyDates(array) {
  let updatedBusyDatesArray = getBusyDates();
  let newArray = updatedBusyDatesArray.concat(array);
  saveBusyDates(newArray);
}

//Function to get all current busy dates from local storage and parse the JSON array
function getBusyDates() {
  let retrievedData = localStorage.getItem("busyDatesArray");
  if (!retrievedData) {
    saveBusyDates(busyDates);
    retrievedData = localStorage.getItem("busyDatesArray");
  }
  let retrievedBusyDatesArray = JSON.parse(retrievedData);
  return retrievedBusyDatesArray;
}

//Event handler to remove busy dates from the schedule and return them to their open state,
//updating local storage to maintain current list
function removeBusyDates(event) {
  event.preventDefault();

  let allBusyDates = getBusyDates();

  let startEntry = document.getElementById("startDate");
  let startDateRemoval = new Date(startEntry.value + "T00:00");

  let endEntry = document.getElementById("endDate");
  let endDateRemoval = new Date(endEntry.value + "T00:00");

  let days = document.querySelectorAll(".daysOfMonth");
  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let dateInQuestion = new Date(currentYear, currentMonth, day);
    if (
      dateInQuestion >= startDateRemoval &&
      dateInQuestion <= endDateRemoval
    ) {
      days[i].classList.remove("busy");
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

//Function to set all the busy dates within presented calendar using persistent list of busy
//dates in local storage
function setAllBusyDates() {
  let allBusyDates = getBusyDates();
  let days = document.querySelectorAll(".daysOfMonth");

  for (let i = 0; i < days.length; i++) {
    let day = Number.parseInt(days[i].innerHTML);
    let date1 = new Date(currentYear, currentMonth, day);
    for (let x = 0; x < allBusyDates.length; x++) {
      let date2 = new Date(allBusyDates[x]);
      if (date1.getTime() == date2.getTime()) days[i].classList.add("busy");
    }
  }
}
