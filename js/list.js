const SHEET_URL ="https://opensheet.elk.sh/1eXfETDikq3Q4addN_0OugOBjkOu_L3VXrUDO_oXt9Qo/Sheet1";


fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => renderCards(data));

function renderCards(vehicles) {
  const container = document.getElementById("vehicleList");

  vehicles.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => {
      window.location.href = `details.html?id=${v.id}`;
    };

    card.innerHTML = `
      <img src="${v.img1}">
      <div class="card-body">
        <h3>${v.make} ${v.model}</h3>
        <div class="price">₹ ${v.price}</div>
        <div class="meta">${v.branch} • ${v.year}</div>
      </div>
    `;

    container.appendChild(card);
  });
}
