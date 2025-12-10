// ----------------------- Helper: Smooth values -----------------------
function smoothData(values, smoothFactor = 0.7) {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    if (i === 0) result.push(values[i]);
    else {
      const smoothed =
        smoothFactor * result[i - 1] + (1 - smoothFactor) * values[i];
      result.push(smoothed);
    }
  }
  return result;
}

// ----------------------- Load Latest -----------------------
async function loadLatest() {
  try {
    const res = await fetch("/api/readings/latest");
    const data = await res.json();

    if (!data || !data.temperature) return;

    document.getElementById("current-temp").textContent =
      data.temperature.toFixed(1);
    document.getElementById("current-hum").textContent = data.humidity;
    document.getElementById("current-wind").textContent = data.windSpeed;
    document.getElementById("current-noise").textContent = data.noiseLevel;

    document.getElementById("current-time").textContent = new Date(
      data.timestamp
    ).toLocaleString();

    document.getElementById("current-feel").textContent = buildFeelingText(
      data.temperature,
      data.humidity
    );
  } catch (err) {
    console.error("Latest load failed:", err);
  }
}

function buildFeelingText(t, h) {
  if (t >= 40) return "🔥 Extreme heat — stay hydrated!";
  if (t >= 32) return "🥵 Very hot — avoid long exposure.";
  if (t >= 25) return "🌤 Warm and pleasant";
  if (t <= 10) return "❄️ Cold — keep yourself warm";
  return "😊 Comfortable weather";
}

// ----------------------- Charts -----------------------
let tempChart, humChart;

async function loadTrends() {
  const range = document.getElementById("range-filter").value;
  const res = await fetch(`/api/readings?range=${range}`);
  const rows = await res.json();

  const labels = rows.map((r) =>
    new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const tempsRaw = rows.map((r) => r.temperature);
  const humsRaw = rows.map((r) => r.humidity);

  const temps = smoothData(tempsRaw, 0.85);
  const hums = smoothData(humsRaw, 0.85);

  // Destroy old charts
  if (tempChart) tempChart.destroy();
  if (humChart) humChart.destroy();

  // Create gradient fills
  const ctxT = document.getElementById("tempChart").getContext("2d");
  const tempGradient = ctxT.createLinearGradient(0, 0, 0, 350);
  tempGradient.addColorStop(0, "rgba(77,184,255,0.45)");
  tempGradient.addColorStop(1, "rgba(77,184,255,0)");

  const ctxH = document.getElementById("humChart").getContext("2d");
  const humGradient = ctxH.createLinearGradient(0, 0, 0, 350);
  humGradient.addColorStop(0, "rgba(102,255,153,0.45)");
  humGradient.addColorStop(1, "rgba(102,255,153,0)");

  // ---------------- Temperature Chart ----------------
  tempChart = new Chart(ctxT, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "#4db8ff",
          backgroundColor: tempGradient,
          tension: 0.45,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: true } },
      scales: {
        y: {
          beginAtZero: false,
          grace: "10%",
        },
      },
    },
  });

  // ---------------- Humidity Chart ----------------
  humChart = new Chart(ctxH, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Humidity (%)",
          data: hums,
          borderColor: "#66ff99",
          backgroundColor: humGradient,
          tension: 0.45,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: true } },
      scales: {
        y: {
          beginAtZero: false,
          grace: "10%",
        },
      },
    },
  });
}

// ----------------------- Tabs -----------------------
document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.remove("active");
      if (t.id === `tab-${tab}`) t.classList.add("active");
    });
  });
});

document
  .getElementById("range-filter")
  .addEventListener("change", loadTrends);

window.onload = () => {
  loadLatest();
  loadTrends();
  setInterval(loadLatest, 15000);
};

window.onload = () => {
  loadLatest();
  loadTrends();

  // Auto-refresh Latest Sensor Values
  setInterval(() => {
    loadLatest();
  }, 5000);  // every 5 seconds

  // Auto-refresh Trend Charts
  setInterval(() => {
    loadTrends();
  }, 20000); // every 20 seconds
};
