"use strict";

let modal = document.getElementById("imagePopup");
let modalImg = document.getElementById("shownImage");
let captionText = document.getElementById("caption");

let galleryImages = document.querySelectorAll(".galleryImage");
for (let i = 0; i < galleryImages.length; i++) {
  galleryImages[i].addEventListener("click", displayModalImage);
}

function displayModalImage() {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

var span = document.getElementsByClassName("closeModal")[0];
span.addEventListener("click", closeModalImage);

function closeModalImage() {
  modal.style.display = "none";
}
