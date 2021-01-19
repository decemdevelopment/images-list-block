(function () {
  let items = document.querySelectorAll(".js-images-list-item");

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("mouseover", function () {
      let indexOfImageToShow = this.getAttribute("data-list-index");
      let imageToShow = document.querySelector(
        `[data-list-image-index='${indexOfImageToShow}']`
      );

      imageToShow.classList.add("images-list-block__media-item--active");
    });

    items[i].addEventListener("mouseout", function () {
      let indexOfImageToShow = this.getAttribute("data-list-index");
      let imageToShow = document.querySelector(
        `[data-list-image-index='${indexOfImageToShow}']`
      );
      imageToShow.classList.remove("images-list-block__media-item--active");
    });
  }
})();
