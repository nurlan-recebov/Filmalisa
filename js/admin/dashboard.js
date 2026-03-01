const API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard";
const token = localStorage.getItem("token");
const loader = document.getElementById("loader");
const cards = document.querySelectorAll(".admin-stat-card-value");

async function getDashboard() {
  loader?.classList.remove("loader-hidden");
  try {
    const res = await fetch(API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    const data = result.data;

    cards[0].textContent = data?.favorites || 0;
    cards[1].textContent = data?.users || 0;
    cards[2].textContent = data?.movies || 0;
    cards[3].textContent = data?.comments || 0;
    cards[4].textContent = data?.categories || 0;
    cards[5].textContent = data?.actors || 0;
    cards[6].textContent = data?.contacts || 0;
  } catch (error) {
    console.log("Dashboard xətası:", error);
  } finally {
    setTimeout(() => {
      loader?.classList.add("loader-hidden");
    }, 500);
  }
}

getDashboard();
