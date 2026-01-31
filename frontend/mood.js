
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function todayDate() {
    return new Date().toISOString().split("T")[0];
}

function getMoodKey(username) {
    return `moods_${username}`;
}

function getSavedMoods(username) {
    return JSON.parse(localStorage.getItem(getMoodKey(username))) || [];
}

// main logic
document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // nabar, logout
    const navAvatar = document.getElementById("nav-avatar");
    if (navAvatar) {
        const pic = localStorage.getItem(`profilePic_${user.username}`);
        if (pic) {
            navAvatar.innerHTML = `<img src="${pic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        } else {
        
            navAvatar.textContent = (user.displayName || user.username)[0].toUpperCase();
            navAvatar.style.display = "flex";
            navAvatar.style.alignItems = "center";
            navAvatar.style.justifyContent = "center";
            navAvatar.style.fontWeight = "bold";
            navAvatar.style.color = "white";
        }
    }

    const logoutBtnIds = ["direct-logout-btn", "logout-btn"];
    logoutBtnIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem("currentUser");
                localStorage.setItem("showLogin", "true");
                window.location.href = "index.html";
            };
        }
    });

    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodStatus = document.getElementById("mood-status");
    const historyBox = document.getElementById("mood-history");
    const overviewBox = document.getElementById("mood-overview");
    const moodBadge = document.getElementById("mood-saved-badge");

    refreshUI();

    function refreshUI() {
        const moods = getSavedMoods(user.username);
        const today = todayDate();
        const todayEntry = moods.find(m => m.date === today);

        if (todayEntry) {
            if (moodStatus) moodStatus.textContent = todayEntry.message;
            if (moodBadge) moodBadge.classList.remove("hidden");
        } else {
            if (moodStatus) moodStatus.textContent = "You haven't tracked your mood yet today.";
            if (moodBadge) moodBadge.classList.add("hidden");
        }

        if (historyBox) renderHistory(moods);
        if (overviewBox) renderOverview(moods);
    }

    moodButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            let mood = btn.textContent.trim().split(" ")[1]; 
            let message = "";

            if (mood === "Good") message = "Peace begins with a smile 😊";
            else if (mood === "Neutral") message = "Fall seven times, stand up eight 💪🏻";
            else message = "Every moment is a fresh beginning 🌸";

            saveMood(user.username, mood, message);
            refreshUI();
        });
    });

    function saveMood(username, mood, message) {
        let moods = getSavedMoods(username);
        const today = todayDate();
        const existingIdx = moods.findIndex(m => m.date === today);
        const newEntry = { date: today, mood, message };

        if (existingIdx > -1) {
            moods[existingIdx] = newEntry;
        } else {
            moods.unshift(newEntry);
        }
        localStorage.setItem(getMoodKey(username), JSON.stringify(moods));
    }

    function renderHistory(moods) {
        historyBox.innerHTML = "";
        if (moods.length === 0) {
            historyBox.innerHTML = "<p class='muted-text'>No mood history yet</p>";
            return;
        }

        moods.forEach(m => {
            const div = document.createElement("div");
            div.className = "mood-history-item";
            const emoji = m.mood === "Good" ? "😊" : m.mood === "Neutral" ? "😐" : "☹️";
            div.innerHTML = `
                <span class="history-date">${m.date === todayDate() ? "Today" : m.date}</span>
                <span class="history-mood">${emoji} ${m.mood}</span>
            `;
            historyBox.appendChild(div);
        });
    }

    function renderOverview(moods) {
        let stats = { Good: 0, Neutral: 0, Bad: 0 };
        moods.forEach(m => {
            if (stats[m.mood] !== undefined) stats[m.mood]++;
        });

        overviewBox.innerHTML = `
            <div class="stat-row"><span>😊 Good</span> <strong>${stats.Good}</strong></div>
            <div class="stat-row"><span>😐 Neutral</span> <strong>${stats.Neutral}</strong></div>
            <div class="stat-row"><span>☹️ Bad</span> <strong>${stats.Bad}</strong></div>
        `;
    }

    const avatarBtn = document.getElementById("avatar-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    if (avatarBtn && profileDropdown) {
        avatarBtn.onclick = (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle("hidden");
        };
        document.addEventListener("click", () => profileDropdown.classList.add("hidden"));
    }
});