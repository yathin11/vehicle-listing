document.addEventListener("DOMContentLoaded", () => {

  /* ================= CONFIG ================= */

  const SHEET_URL =
    "https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrNkC8p-GRp45Ulccfsga-cN0dTHV95k_Fl70O70qYPwUoJdaInL12mcRrs6STugbW/exec";

  /* ================= STATE ================= */

  const id = new URLSearchParams(window.location.search).get("id");

  let vehicle = null;
  let images = [];
  let currentIndex = 0;
  let auctionMode = "OFF";

  /* ================= FETCH DATA ================= */

  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {

      vehicle = data.find(v => v.id === id);
      if (!vehicle) return;

      auctionMode = (vehicle.auction_mode || "OFF").toUpperCase();

      /* ---------- SALE TITLE ---------- */
      const saleTitle = data[0]?.sale_title || "";
      document.getElementById("saleTitle").innerText = saleTitle;

      /* ---------- IMAGES ---------- */
      images = [
        vehicle.img1,
        vehicle.img2,
        vehicle.img3,
        vehicle.img4,
        vehicle.img5
      ].filter(Boolean);

      if (images.length) showImage(0);

      /* ---------- TITLE ---------- */
      document.getElementById("title").innerText = vehicle.make;

      /* ---------- LEFT COLUMN ---------- */
      regno.innerText = vehicle.id;
      owners.innerText = vehicle.owners;
      fuel.innerText = vehicle.fuel;
      surrender.innerText = vehicle.surrender_status;
      sale_code.innerText = vehicle.sale_code;
      price.innerText = vehicle.sale_price;

      /* ---------- RIGHT COLUMN ---------- */
      model.innerText = vehicle.model;
      ic.innerText = vehicle.ic;
      fc.innerText = vehicle.fc;
      tax.innerText = vehicle.tax;
      contact.innerText = vehicle.contact;

      /* ---------- AUCTION UI ---------- */
      handleAuctionUI();
    });

  /* ================= AUCTION UI ================= */

  function handleAuctionUI() {
    const reserveBtn = document.getElementById("reserveBtn");
const bidBtn = document.getElementById("bidBtn");

if (auctionMode === "ON") {
  auctionBox.style.display = "block";

  if (vehicle.reserved_by && vehicle.reserved_by.trim() !== "") {
    reserveBtn.style.display = "none";
    bidBtn.style.display = "block";
  } else {
    reserveBtn.style.display = "block";
    bidBtn.style.display = "none";
  }

} else {
  auctionBox.style.display = "none";
}

  }

  /* ================= MODAL ================= */

  window.openReserve = () => openModal("RESERVE");
  window.openBid = () => openModal("BID");

  function openModal(type) {
    auctionModal.style.display = "flex";
    modalTitle.innerText =
      type === "RESERVE" ? "Reserve Vehicle" : "Place Bid";

    amount.style.display = type === "BID" ? "block" : "none";
    auctionModal.dataset.action = type;
  }

  window.closeModal = () => {
    auctionModal.style.display = "none";
  };

  /* ================= SUBMIT ================= */

  window.submitAuction = () => {
    const manager = managerSelect.value;
    const action = auctionModal.dataset.action;
    const bid = amount.value;

    if (!manager) {
      alert("Please select your name");
      return;
    }

    if (action === "BID" && !bid) {
      alert("Please enter bid amount");
      return;
    }

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.make,
        manager: manager,
        action: action,
        bid_amount: bid || vehicle.bid_amount || ""
      })
    })
      .then(() => {
        alert("Submitted successfully");
        closeModal();
        location.reload(); // refresh to update buttons
      })
      .catch(() => {
        alert("Submission failed. Please try again.");
      });
  };

  /* ================= IMAGE ================= */

  window.showImage = i => {
    currentIndex = i;
    mainImage.src = images[currentIndex];
  };

  window.nextImg = () =>
    showImage((currentIndex + 1) % images.length);

  window.prevImg = () =>
    showImage((currentIndex - 1 + images.length) % images.length);

  /* ================= ZOOM ================= */

  window.openZoom = () => {
    zoomImg.src = mainImage.src;
    zoomModal.style.display = "flex";
  };

  window.closeZoom = () => {
    zoomModal.style.display = "none";
  };

});
