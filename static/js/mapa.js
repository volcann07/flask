document.addEventListener("DOMContentLoaded", () => {
  const center = [-32.85, -68.83];
  const mapElement = document.getElementById("recycling-map");
  const notice = document.getElementById("map-notice");
  const results = document.getElementById("point-results");
  const count = document.getElementById("point-count");
  const search = document.getElementById("point-search");
  const filters = document.getElementById("material-filters");
  let points = [];
  let selectedMaterial = "all";
  let markers = [];

  if (!window.L) {
    notice.classList.add("is-error");
    notice.innerHTML = "<strong>El mapa no pudo cargarse.</strong><span>Verificá tu conexión e intentá actualizar la página.</span>";
    return;
  }

  const map = L.map(mapElement, { scrollWheelZoom: false }).setView(center, 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: "aura-marker",
    html: '<span><i data-lucide="recycle"></i></span>',
    iconSize: [38, 44],
    iconAnchor: [19, 40],
    popupAnchor: [0, -38],
  });

  function filteredPoints() {
    const query = search.value.trim().toLocaleLowerCase("es");
    return points.filter((point) => {
      const text = `${point.name} ${point.address}`.toLocaleLowerCase("es");
      const materials = (point.materials || []).map((material) => material.toLocaleLowerCase("es"));
      return (!query || text.includes(query))
        && (selectedMaterial === "all" || materials.includes(selectedMaterial));
    });
  }

  function showResults() {
    const visiblePoints = filteredPoints();
    results.replaceChildren();
    count.textContent = String(visiblePoints.length).padStart(2, "0");

    if (!visiblePoints.length) {
      const empty = document.createElement("div");
      empty.className = "point-empty";
      const title = document.createElement("strong");
      title.textContent = points.length
        ? "No encontramos coincidencias."
        : "Todavía no hay puntos verificados.";
      const detail = document.createElement("span");
      detail.textContent = points.length
        ? "Probá con otro nombre, dirección o material."
        : "Estamos esperando información oficial para completar el mapa.";
      empty.append(title, detail);
      results.append(empty);
    } else {
      visiblePoints.forEach((point) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "point-result";
        const name = document.createElement("strong");
        name.textContent = point.name;
        const address = document.createElement("span");
        address.textContent = point.address;
        item.append(name, address);
        item.addEventListener("click", () => map.setView([point.lat, point.lng], 16));
        results.append(item);
      });
    }

    markers.forEach((marker) => map.removeLayer(marker));
    markers = visiblePoints.map((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: markerIcon }).addTo(map);
      const popup = document.createElement("div");
      popup.className = "map-popup";
      const title = document.createElement("strong");
      title.textContent = point.name;
      const address = document.createElement("span");
      address.textContent = point.address;
      const materials = document.createElement("p");
      materials.textContent = `Recibe: ${(point.materials || []).join(", ") || "Consultar"}`;
      const hours = document.createElement("span");
      hours.textContent = point.hours ? `Horarios: ${point.hours}` : "Horarios: no informados";
      const extra = document.createElement("p");
      extra.textContent = point.info || "";
      popup.append(title, address, materials, hours, extra);
      marker.bindPopup(popup);
      return marker;
    });
    window.lucide?.createIcons();
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-material]");
    if (!button) return;
    selectedMaterial = button.dataset.material;
    filters.querySelectorAll("[data-material]").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    showResults();
  });
  search.addEventListener("input", showResults);
  document.getElementById("map-reset").addEventListener("click", () => map.setView(center, 12));

  fetch("/api/puntos-reciclaje")
    .then((response) => {
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.points)) throw new Error("Formato de puntos no válido.");
      points = data.points.filter((point) => (
        point.verified === true
        && Number.isFinite(point.lat)
        && Number.isFinite(point.lng)
        && typeof point.name === "string"
        && typeof point.address === "string"
      ));
      if (points.length) notice.hidden = true;
      showResults();
    })
    .catch((error) => {
      console.error("No se pudo cargar el catálogo de puntos de reciclaje:", error);
      notice.classList.add("is-error");
      notice.innerHTML = "<strong>No pudimos cargar los puntos.</strong><span>Intentá actualizar la página. El mapa base sigue disponible.</span>";
    });

  window.lucide?.createIcons();
});
