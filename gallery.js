/*
Name:   Reeve Jarvis
Course: DGL-113
Section: DLU1
Assignment: Course Project
Update Date: 04/04/2021

Filename:   gallery.js

Gallery modal box functionality, bringing popout image capability to the gallery on my About Me page.
*/

"use strict";

//Get ahold of modal container and contents
let modal = document.getElementById("imagePopup");
let modalImg = document.getElementById("shownImage");
let captionText = document.getElementById("caption");

//Get ahold of all gallery images and set event listeners on them all
let galleryImages = document.querySelectorAll(".galleryImage");
for (let i = 0; i < galleryImages.length; i++) {
  galleryImages[i].addEventListener("click", displayModalImage);
}

//Get ahold of modal closer and add event listener
let span = document.getElementsByClassName("closeModal")[0];
span.addEventListener("click", closeModalImage);

//Display selected modal image on top of screen with caption comprised of the alt text
function displayModalImage() {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

//Close the modal image by setting its display attribute to none
function closeModalImage() {
  modal.style.display = "none";
}
