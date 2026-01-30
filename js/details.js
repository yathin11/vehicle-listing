document.addEventListener("DOMContentLoaded", () => {

  /* ================= CONFIG ================= */

  const SHEET_URL =
    "https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";

  // 🔗 Google Apps Script Web App URL
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgNl1AaOe6_dk9zAvBcsqI5C2TjrDNgHwqiiycfeuzFoFQHXFYJlSK-ZeJrrGlfk3T/exec";

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
      document.getElementById("regno").innerText = vehicle.id;
      document.getElementById("owners").innerText = vehicle.owners;
      document.getElementById("fuel").innerText = vehicle.fuel;
      document.getElementById("surrender").innerText = vehicle.surrender_status;
      document.getElementById("sale_code").innerText = vehicle.sale_code;
      document.getElementById("price").innerText = vehicle.sale_price;

      /* ---------- RIGHT COLUMN ---------- */
      document.getElementById("model").innerText = vehicle.model;
      document.getElementById("ic").innerText = vehicle.ic;
      document.getElementById("fc").innerText = vehicle.fc;
      document.getElementById("tax").innerText = vehicle.tax;
      document.getElementById("contact").innerText = vehicle.contact;

      /* ---------- MANAGER LIST ---------- */
      const select = document.getElementById("managerSelect");
      select.innerHTML = `<option value="">Select your name</option>`;

      (vehicle.manager_list || "")
        .split(",")
        .map(n => n.trim())
        .filter(Boolean)
        .forEach(name => {
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          select.appendChild(opt);
        });

      /* ---------- AUCTION UI ---------- */
      handleAuctionUI();
    });

  /* ================= AUCTION UI ================= */

  function handleAuctionUI() {
    const auctionBox = document.getElementById("auctionBox");

    if (auctionMode === "ON") {
      auctionBox.style.display = "block";
    } else {
      auctionBox.style.display = "none";
    }
  }

  /* ================= MODAL CONTROLS ================= */

  window.openReserve = () => openModal("RESERVE");
  window.openBid = () => openModal("BID");

  function openModal(type) {
    document.getElementById("auctionModal").style.display = "flex";
    document.getElementById("modalTitle").innerText =
      type === "RESERVE" ? "Reserve Vehicle" : "Place Bid";

    document.getElementById("amount").style.display =
      type === "BID" ? "block" : "none";

    document.getElementById("auctionModal").dataset.action = type;
  }

  window.closeModal = () => {
    document.getElementById("auctionModal").style.display = "none";
  };

  /* ================= SUBMIT (RESERVE / BID) ================= */

  window.submitAuction = () => {
    const manager = document.getElementById("managerSelect").value;
    const action  = document.getElementById("auctionModal").dataset.action;
    const bid     = document.getElementById("amount").value;

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
        bid_amount: bid || ""
      })
    })
      .then(() => {
        alert("Submitted successfully");
        closeModal();
      })
      .catch(() => {
        alert("Submission failed. Please try again.");
      });
  };

  /* ================= IMAGE CONTROLS ================= */

  window.showImage = i => {
    currentIndex = i;
    document.getElementById("mainImage").src = images[currentIndex];
  };

  window.nextImg = () =>
    showImage((currentIndex + 1) % images.length);

  window.prevImg = () =>
    showImage((currentIndex - 1 + images.length) % images.length);

  /* ================= ZOOM ================= */

  window.openZoom = () => {
    document.getElementById("zoomImg").src =
      document.getElementById("mainImage").src;
    document.getElementById("zoomModal").style.display = "flex";
  };

  window.closeZoom = () => {
    document.getElementById("zoomModal").style.display = "none";
  };

});
