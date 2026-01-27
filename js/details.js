document.addEventListener("DOMContentLoaded", () => {

  const SHEET_URL =
    "https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("No vehicle ID in URL");
    return;
  }

  let images = [];
  let currentIndex = 0;

  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      const v = data.find(item => item.id === id);

      if (!v) {
        console.error("Vehicle not found for ID:", id);
        return;
      }

      images = [v.img1, v.img2, v.img3].filter(Boolean);

      if (images.length > 0) {
        showImage(0);
      }

      document.getElementById("details").innerHTML = `
        <h2>${v.make} ${v.model}</h2>
        <p><strong>Price:</strong> ₹ ${v.price}</p>
        <p><strong>Year:</strong> ${v.year}</p>
        <p><strong>Fuel:</strong> ${v.fuel}</p>
        <p><strong>Branch:</strong> ${v.branch}</p>
        <p><strong>IC:</strong> ${v.ic}</p>
        <p><strong>FC:</strong> ${v.fc}</p>
        <p><strong>Tax:</strong> ${v.tax}</p>
        <p><strong>Contact:</strong> ${v.contact}</p>
      `;
    })
    .catch(err => console.error("Sheet fetch error:", err));

  window.showImage = function (index) {
    currentIndex = index;
    document.getElementById("mainImage").src = "./" + images[currentIndex];
  };

  window.nextImg = function () {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  window.prevImg = function () {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  window.openZoom = function () {
    document.getElementById("zoomImg").src =
      document.getElementById("mainImage").src;
    document.getElementById("zoomModal").style.display = "flex";
  };

  window.closeZoom = function () {
    document.getElementById("zoomModal").style.display = "none";
  };

});
