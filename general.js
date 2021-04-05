/*
Name:   Reeve Jarvis
Course: DGL-113
Section: DLU1
Assignment: Course Project
Update Date: 04/04/2021

Filename:   general.js

General Javascript functionality for the whole website, including "pretend" admin login, cookie storage/access, and theme selection.
*/

"use strict";

//On load event listeners to set admin access features and current theme using cookies
window.addEventListener("load", checkForAdmin);
window.addEventListener("load", themeEnabler);

/* Pretend Log In/Admin Access  */

//Pretend log in credentials (unsecure, but just for a display of functionality on github pages site)
const ADMIN = "ItsJustJarvis";
const CREDENTIALS = "admin";

//Get ahold of login form and buttons, add event listeners for log in and log out response
let loginForm = document.getElementById("adminLogIn");
let loginButton = document.getElementById("submitLogIn");
loginButton.addEventListener("click", loggingIn);
let logoutButton = document.getElementById("logOut");
logoutButton.addEventListener("click", loggingOut);

//When logging in, get the input form values and compare to admin credentials.
//If successful display admin features and save username as cookie for persistence, else alert incorrect entry.
function loggingIn(event) {
  event.preventDefault();

  let username = loginForm.username.value;
  let password = loginForm.password.value;

  if (username === ADMIN && password === CREDENTIALS) {
    alert("Welcome Back Reeve!");
    createCookie("userName", username, 1, "/");
    adminAccess();
  } else {
    alert("Incorrect Log-In Details");
  }
}

//Logging out will hide admin features and remove cookie for admin username, then reload the page
function loggingOut(event) {
  event.preventDefault();
  hideAdmin();
  createCookie("userName", "", -1, "/");
  location.reload();
  return false;
}

//Check for admin credentials from cookies and display content accordingly
function checkForAdmin() {
  let currentUser = getCookie("userName");
  if (currentUser == ADMIN) {
    adminAccess();
  } else hideAdmin();
}

//Display admin only content (currently only implemented in calendar entry)
function adminAccess() {
  loginForm.style.display = "none";
  let adminViewList = document.querySelectorAll(".adminOnly");
  for (let i = 0; i < adminViewList.length; i++)
    adminViewList[i].style.display = "table-row";
}

//Hide admin only content
function hideAdmin() {
  let adminViewList = document.querySelectorAll(".adminOnly");
  for (let i = 0; i < adminViewList.length; i++)
    adminViewList[i].style.display = "none";
}

/* Black And White Mode */

//Declare variables for different themes
let themeBW, themeColour;

//Get ahold of theme button, and add event listener
let themeButton = document.getElementById("themeButton");
themeButton.addEventListener("click", changeMode);

//Theme enabler refactored and implemented much cleaner than in previous assignment
//Get cookie for current theme and set accordingly by accessing stylesheet list and
//attaching variables to govern each theme.
//Set the proper button text, and photos (colour or black and white)
function themeEnabler() {
  let themeReference = getCookie("theme");
  let allStyleSheets = document.styleSheets;

  for (let i = 0; i < allStyleSheets.length; i++) {
    if (allStyleSheets[i].href.indexOf("css_blackAndWhiteStyles.css") != -1)
      themeBW = allStyleSheets[i];
    if (allStyleSheets[i].href.indexOf("css_colourStyles.css") != -1)
      themeColour = allStyleSheets[i];
  }

  if (themeReference == null) {
    themeBW.disabled = true;
  } else if (themeReference == themeBW.href) {
    themeColour.disabled = true;
  } else {
    themeBW.disabled = true;
  }
  setThemeButtonText();
  setThemePhotos();
}

//Function used to adjust the photos used based on theme by changing their src path
function setThemePhotos() {
  let allPhotos = document.querySelectorAll("img");
  let photoSourceFolder;

  if (themeBW.disabled) photoSourceFolder = "photos";
  if (themeColour.disabled) photoSourceFolder = "bwPhotos";

  for (let i = 0; i < allPhotos.length; i++) {
    let path = allPhotos[i].src;
    let pathArray = path.split("/");
    let file = pathArray[pathArray.length - 1];
    let newSRC = `${photoSourceFolder}/${file}`;
    allPhotos[i].setAttribute("src", newSRC);
  }
}

//Function to set the theme button text according to current theme
function setThemeButtonText() {
  if (themeBW.disabled) {
    themeButton.innerHTML = "Black/White Mode";
    createCookie("theme", themeColour.href);
  }
  if (themeColour.disabled) {
    themeButton.innerHTML = "Colour Mode";
    createCookie("theme", themeBW.href);
  }
}

//Event handler to change the theme on theme button click
function changeMode() {
  themeBW.disabled = !themeBW.disabled;
  themeColour.disabled = !themeBW.disabled;
  setThemeButtonText();
  setThemePhotos();
}

/* Cookies */

//Creating cookies function pulled from course materials
function createCookie(name, value, days, path, domain, secure) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = date.toGMTString();
  } else expires = "";
  let cookieString = name + "=" + escape(value);
  if (expires) cookieString += "; expires=" + expires;
  if (path) cookieString += "; path=" + escape(path);
  if (domain) cookieString += "; domain=" + escape(domain);
  if (secure) cookieString += "; secure";
  document.cookie = cookieString;
}

//Getting cookie function pulled from course materials
function getCookie(name) {
  var nameEquals = name + "=";
  var crumbs = document.cookie.split(";");
  for (var i = 0; i < crumbs.length; i++) {
    var crumb = crumbs[i].trim();
    if (crumb.indexOf(nameEquals) == 0) {
      return unescape(crumb.substring(nameEquals.length, crumb.length));
    }
  }
  return null;
}
