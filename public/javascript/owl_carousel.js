const rightControl = document.querySelector(".services__right");
const leftControl = document.querySelector(".services__left");

const carouselItem = document.querySelectorAll(".services__card");

let toggler = 0;
rightControl.addEventListener("click", function () {
  toggler++;
  for (let item of carouselItem) {
    if (toggler == 0) {
      item.style.left = "0px";
    }
    if (toggler == 1) {
      item.style.left = "-360px";
    }
    if (toggler == 2) {
      item.style.left = "-720px";
    }
    if (toggler == 3) {
      item.style.left = "-1080px";
    }
    if (toggler == 4) {
      item.style.left = "-1450px";
    }
    if (toggler == 5) {
      item.style.left = "-1820px";
    }
    if (toggler == 6) {
      item.style.left = "-2190px";
    }
    if (toggler > 6) {
      toggler = 6;
      console.log("mwisho");
    }
  }
});

leftControl.addEventListener("click", function () {
  toggler--;
  for (let item of carouselItem) {
    if (toggler == 0) {
      item.style.left = "0px";
    }
    if (toggler == 1) {
      item.style.left = "-360px";
    }
    if (toggler == 2) {
      item.style.left = "-720px";
    }
    if (toggler == 3) {
      item.style.left = "-1080px";
    }
    if (toggler == 4) {
      item.style.left = "-1450px";
    }
    if (toggler == 5) {
      item.style.left = "-1820px";
    }
    if (toggler == 6) {
      item.style.left = "-2160px";
    }
    if (toggler < 0) {
      toggler = 0;
      console.log("mwisho 2");
    }
  }
});
