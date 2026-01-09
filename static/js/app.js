let map;
let marker;

function showMapView() {
  document.getElementById("mapView").classList.remove("hidden");
  document.getElementById("serviceView").classList.add("hidden");
}

function showServiceView() {
  document.getElementById("serviceView").classList.remove("hidden");
  document.getElementById("mapView").classList.add("hidden");
}

function lookup() {
  const phone = document.getElementById("phone").value;
  if (!phone) return alert("Enter a phone number");

  fetch("/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Map data
      document.getElementById("mapMobile").innerText = phone;
      document.getElementById("mapLat").innerText = data.latitude ?? "—";
      document.getElementById("mapLng").innerText = data.longitude ?? "—";

      if (data.latitude && data.longitude) {
        loadMap(data.latitude, data.longitude);
      }

      // Service data
      document.getElementById("srvMobile").innerText = phone;
      document.getElementById("srvLocation").innerText = data.location ?? "—";
      document.getElementById("srvCarrier").innerText = data.carrier ?? "—";

      if (data.provider_info) {
        document.getElementById("providerLogo").src =
          "/static/images/" + data.provider_info.logo;
        document.getElementById("providerDesc").innerText =
          data.provider_info.description;
      } else {
        document.getElementById("providerLogo").src =
          "/static/images/default.png";
        document.getElementById("providerDesc").innerText =
          "No additional data currently available for this service provider.";
      }
    })
    .catch(() => alert("Backend not reachable"));
}
function setActiveNav(activeId) {
  document.getElementById("navMap").classList.remove("active");
  document.getElementById("navService").classList.remove("active");
  document.getElementById(activeId).classList.add("active");
}

function showMapView() {
  document.getElementById("mapView").classList.remove("hidden");
  document.getElementById("serviceView").classList.add("hidden");
  setActiveNav("navMap");
}

function showServiceView() {
  document.getElementById("serviceView").classList.remove("hidden");
  document.getElementById("mapView").classList.add("hidden");
  setActiveNav("navService");
}

function loadMap(lat, lng) {
  if (!map) {
    map = L.map("map").setView([lat, lng], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.setView([lat, lng], 5);
    marker.setLatLng([lat, lng]);
  }
}
