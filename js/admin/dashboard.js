const API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard";
const token = localStorage.getItem("token");

const cards = document.querySelectorAll(".admin-stat-card-value");

async function getDashboard() {
  try {
    const res = await fetch(API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    const data = result.data;

    cards[0].textContent = data.favorites;
    cards[1].textContent = data.users;
    cards[2].textContent = data.movies;
    cards[3].textContent = data.comments;
    cards[4].textContent = data.categories;
    cards[5].textContent = data.actors;
    cards[6].textContent = data.contacts;

  } catch (error) {
    console.log("Dashboard xətası:", error);
  }
}

getDashboard();