console.log("mood.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const API_BASE = "http://localhost:5000/api/mood";
  const AUTH_API = "http://localhost:5000/api/auth";

  const moodButtons = document.querySelectorAll(".mood-btn");
  const historyBox = document.getElementById("mood-history");
  const moodStatus = document.getElementById("mood-status");

  /* ================= NAVBAR PROFILE SYNC ================= */
  async function syncNavbar() {
    try {
      const response = await fetch(`${AUTH_API}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = await response.json();

      if (response.ok) {
        const navAvatar = document.getElementById("nav-avatar");
        if (!navAvatar) return;

        if (userData.profilePic && userData.profilePic.startsWith("data:image")) {
          navAvatar.innerHTML = `
            <img src="${userData.profilePic}"
                 style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
          `;
          navAvatar.style.backgroundColor = "transparent";
        } else {
          const initial = userData.displayName
            ? userData.displayName[0].toUpperCase()
            : "U";
          navAvatar.innerHTML = "";
          navAvatar.textContent = initial;
          navAvatar.style.display = "flex";
          navAvatar.style.alignItems = "center";
          navAvatar.style.justifyContent = "center";
          navAvatar.style.backgroundColor = "#e15b85";
        }
      }
    } catch (err) {
      console.error("Navbar sync error:", err);
    }
  }

  /* ================= FETCH MOOD HISTORY ================= */
  async function loadMoodHistory() {
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error("History fetch failed");

      refreshUI(data.moodHistory || []);
    } catch (err) {
      console.error("Mood history error:", err);
    }
  }

  /* ================= SAVE MOOD ================= */
  moodButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const mood = btn.innerText.split(" ")[0]; // Good / Neutral / Bad
      const status = `${mood} Day`;

      try {
        const res = await fetch(`${API_BASE}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Save failed");

        refreshUI(data.moodHistory);
      } catch (err) {
        console.error("Mood save error:", err);
      }
    });
  });

  /* ================= UI UPDATE ================= */
  function refreshUI(history) {
    const today = new Date().toDateString();

    moodButtons.forEach(btn => btn.classList.remove("active"));

    const stats = { Good: 0, Neutral: 0, Bad: 0 };

    history.forEach(item => {
      if (stats[item.mood] !== undefined) stats[item.mood]++;
    });

    const todayEntry = history.find(
      h => new Date(h.date).toDateString() === today
    );

    if (todayEntry) {
      moodButtons.forEach(btn => {
        if (btn.innerText.includes(todayEntry.mood)) {
          btn.classList.add("active");
        }
      });
      moodStatus.textContent = `Today's Mood: ${todayEntry.mood}`;
    } else {
      moodStatus.textContent = "You haven't marked today's mood yet";
    }

    renderHistory(history);
  }

  /* ================= HISTORY ================= */
  function renderHistory(history) {
    if (!historyBox) return;

    if (!history.length) {
      historyBox.innerHTML = "<p>No history yet</p>";
      return;
    }

    historyBox.innerHTML = history
      .slice()
      .reverse()
      .map(
        h => `
        <div class="mood-history-item">
          <span>${new Date(h.date).toLocaleDateString()}</span>
          <strong>${h.mood}</strong>
        </div>
      `
      )
      .join("");
  }

  /* ================= INIT ================= */
  syncNavbar();       // ✅ THIS WAS MISSING
  loadMoodHistory();  // mood logic
});

/* ================= LOGOUT ================= */
const logoutBtn = document.getElementById("direct-logout-btn");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  };
}
