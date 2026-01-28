const SHEET_URL =
  "https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";

let allVehicles = [];

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    allVehicles = data;
    renderCards(allVehicles);
  });

function renderCards(vehicles) {
  const container = document.getElementById("vehicleList");
  container.innerHTML = "";

  vehicles.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";

    const vehicleName = `${v.make} ${v.model}`.toLowerCase();
    card.dataset.name = vehicleName;

    card.onclick = () => {
      window.location.href = `details.html?id=${v.id}`;
    };

    card.innerHTML = `
      <img src="${v.img1}">
      <div class="card-body">
        <h3>${v.make} ${v.model}</h3>
        <div class="price">₹ ${v.sale_price}</div>
        <div class="meta">${v.fuel} • ${v.owners}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterVehicles() {
  const query = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  document.querySelectorAll(".card").forEach(card => {
    const name = card.dataset.name;
    card.style.display = name.includes(query) ? "block" : "none";
  });
}
