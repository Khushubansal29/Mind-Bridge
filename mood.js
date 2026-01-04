// common functions
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.setItem("showLogin", "true");
    window.location.href = "index.html";
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

function saveMoods(username, moods) {
    localStorage.setItem(getMoodKey(username), JSON.stringify(moods));
}

function canSaveMoodToday(username) {
    const moods = getSavedMoods(username);
    const today = todayDate();
    return !moods.some(m => m.date === today);
}

function saveTodayMood(username, mood, message) {
    if (!canSaveMoodToday(username)) {
        alert("You have already recorded your mood today 🌱");
        return false;
    }

    const moods = getSavedMoods(username);

    moods.unshift({
        date: todayDate(),
        mood,
        message
    });

    saveMoods(username, moods);
    return true;
}

// main

document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodStatus = document.getElementById("mood-status");
    const historyBox = document.getElementById("mood-history");
    const overviewBox = document.getElementById("mood-overview");
    const moodBadge = document.getElementById("mood-saved-badge");


    const moods = getSavedMoods(user.username);
    const today = todayDate();

//  mood check per day

    const todayMood = moods.find(m => m.date === today);
    if (todayMood) {
        moodStatus.textContent = todayMood.message;
    }
    if (todayMood && moodBadge) {
    moodBadge.classList.remove("hidden");
}
if (moodBadge) {
    moodBadge.classList.remove("hidden");
}

// save mood

moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        let mood = "";
        let message = "";

        if (btn.textContent.includes("Good")) {
            mood = "Good";
            message = "Peace begins with a smile 😊";
        } else if (btn.textContent.includes("Neutral")) {
            mood = "Neutral";
            message = "Fall seven times, stand up eight 💪🏻";
        } else {
            mood = "Bad";
            message = "Every moment is a fresh beginning 🌸";
        }

        const saved = saveTodayMood(user.username, mood, message);

        if (!saved) return;

        moodStatus.textContent = message;

        const updatedMoods = getSavedMoods(user.username);
        renderHistory(updatedMoods);
        renderOverview(updatedMoods);
    });
});

// render history

    function renderHistory(moods) {
        if (!historyBox) return;

        historyBox.innerHTML = "";

        if (moods.length === 0) {
            historyBox.innerHTML = "<p class='muted-text'>No mood history yet</p>";
            return;
        }

        moods.forEach(m => {
            const div = document.createElement("div");
            div.className = "mood-entry";
            div.innerHTML = `
                <strong>${m.date}</strong>
                <p>${m.mood}</p>
            `;
            historyBox.appendChild(div);
        });
    }

// render overview

    function renderOverview(moods) {
        if (!overviewBox) return;

        let good = 0, neutral = 0, bad = 0;

        moods.forEach(m => {
            if (m.mood === "Good") good++;
            if (m.mood === "Neutral") neutral++;
            if (m.mood === "Bad") bad++;
        });

        overviewBox.innerHTML = `
            <p>😊 Good: ${good}</p>
            <p>😐 Neutral: ${neutral}</p>
            <p>☹️ Bad: ${bad}</p>
        `;
    }

// init

    renderHistory(moods);
    renderOverview(moods);

});

document.getElementById("logout-btn").onclick = logoutUser;
