document.addEventListener("DOMContentLoaded", () => {

  const SHEET_URL =
    "https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";

  const id = new URLSearchParams(window.location.search).get("id");
  let images = [];
  let currentIndex = 0;

  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      const v = data.find(item => item.id === id);
      if (!v) return;

      images = [v.img1, v.img2, v.img3, v.img4, v.img5].filter(Boolean);
      showImage(0);

      document.getElementById("title").innerText =
        `${v.make} ${v.model}`;

      document.getElementById("owners").innerText = v.owners;
      document.getElementById("fuel").innerText = v.fuel;
      document.getElementById("surrender").innerText = v.surrender_status;
      document.getElementById("sale_code").innerText = v.sale_code;
      document.getElementById("price").innerText = v.sale_price;

      document.getElementById("ic").innerText = v.ic;
      document.getElementById("fc").innerText = v.fc;
      document.getElementById("tax").innerText = v.tax;
      document.getElementById("contact").innerText = v.contact;
    });

  window.showImage = i => {
    currentIndex = i;
    document.getElementById("mainImage").src = images[currentIndex];
  };

  window.nextImg = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  window.prevImg = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  window.openZoom = () => {
    document.getElementById("zoomImg").src =
      document.getElementById("mainImage").src;
    document.getElementById("zoomModal").style.display = "flex";
  };

  window.closeZoom = () => {
    document.getElementById("zoomModal").style.display = "none";
  };

});
