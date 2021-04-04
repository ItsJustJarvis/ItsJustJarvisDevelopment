"use strict";

window.addEventListener("load", checkForAdmin);
window.addEventListener("load", themeEnabler);

/* Pretend Log In/Admin Access  */

const ADMIN = "ItsJustJarvis";

let loginForm = document.getElementById("adminLogIn");
let loginButton = document.getElementById("submitLogIn");
loginButton.addEventListener("click", loggingIn);
let logoutButton = document.getElementById("logOut");
logoutButton.addEventListener("click", loggingOut);

function loggingIn(event) {
  event.preventDefault();

  let username = loginForm.username.value;
  let password = loginForm.password.value;

  if (username === "ItsJustJarvis" && password === "admin") {
    alert("Welcome Back Reeve!");
    createCookie("userName", username, 1, "/");
    adminAccess();
  } else {
    alert("Incorrect Log-In Details");
  }
}

function loggingOut(event) {
  event.preventDefault();
  hideAdmin();
  createCookie("userName", "", -1, "/");
  location.reload();
  return false;
}

function checkForAdmin() {
  let currentUser = getCookie("userName");
  if (currentUser == ADMIN) {
    adminAccess();
  } else hideAdmin();
}

function adminAccess() {
  loginForm.setAttribute("hidden", "true");
  let adminViewList = document.querySelectorAll(".adminOnly");
  for (let i = 0; i < adminViewList.length; i++)
    adminViewList[i].removeAttribute("hidden");
}

function hideAdmin() {
  let adminViewList = document.querySelectorAll(".adminOnly");
  for (let i = 0; i < adminViewList.length; i++)
    adminViewList[i].setAttribute("hidden", "true");
}

/* Black And White Mode */

let themeBW, themeColour;
let themeButton = document.getElementById("themeButton");
themeButton.addEventListener("click", changeMode);

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

function changeMode() {
  themeBW.disabled = !themeBW.disabled;
  themeColour.disabled = !themeBW.disabled;
  setThemeButtonText();
  setThemePhotos();
}

/* Cookies */

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
