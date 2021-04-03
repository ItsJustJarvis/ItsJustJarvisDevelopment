"use strict";

const ADMIN = "ItsJustJarvis";

let loginForm = document.getElementById("adminLogIn");
let loginButton = document.getElementById("submitLogIn");

loginButton.addEventListener("click", loggingIn);
window.addEventListener("load", checkForAdmin);

function loggingIn(event) {
  event.preventDefault();

  let username = loginForm.username.value;
  let password = loginForm.password.value;

  if (username === "ItsJustJarvis" && password === "admin") {
    alert("Welcome Back Reeve!");
    createCookie("userName", username);
    adminAccess();
  } else {
    alert("Incorrect Log-In Details");
  }
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
    adminViewList[i].style.opacity = "1";
}

function hideAdmin() {
  let adminViewList = document.querySelectorAll(".adminOnly");
  for (let i = 0; i < adminViewList.length; i++)
    adminViewList[i].style.opacity = "0";
}

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
