// common functions
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.setItem("showLogin", "true");
    window.location.href = "index.html";
}

// mood functions

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


/* MAIN */
document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const sections = {
    dashboard: document.getElementById("dashboard-section"),
    journal: document.getElementById("journal-section"),
    circles: document.getElementById("circles-section"),
    mood: document.getElementById("mood-section"),
    profile: document.getElementById("profile-section")
};

function showSection(sectionName) {
    Object.values(sections).forEach(sec => sec.classList.add("hidden"));
    sections[sectionName].classList.remove("hidden");
}

// navbar
const navDashboard = document.getElementById("nav-dashboard");
if (navDashboard) {
    navDashboard.onclick = () => showSection("dashboard");
}

const navJournal = document.getElementById("nav-journal");
if (navJournal) {
    navJournal.onclick = () => {
        showSection("journal");
        renderJournalEntries();
    };
}

const navCircles = document.getElementById("nav-circles");
if (navCircles) {
    navCircles.onclick = () => showSection("circles");
}

const navMood = document.getElementById("nav-mood");
if (navMood) {
    navMood.onclick = () => showSection("mood");
}

const navProfile = document.getElementById("nav-profile");
if (navProfile) {
    navProfile.onclick = () => showSection("profile");
}

    /* ELEMENTS */
    const welcomeText = document.getElementById("welcome-text");
    const interestsBox = document.getElementById("interest-tags");
    const moodStatus = document.getElementById("mood-status");
    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodBadge = document.getElementById("mood-saved-badge");

    const logoutBtn = document.getElementById("logout-btn");

    const dashboardSection = document.getElementById("dashboard-section");
    const journalSection = document.getElementById("journal-section");

    const saveJournalBtn = document.getElementById("save-journal-btn");
    const journalEntriesBox = document.getElementById("journal-entries");

    const btnQuickJournal = document.getElementById("btn-quick-journal");
    const btnViewJournal = document.getElementById("btn-view-journal");

    const quickJournalView = document.getElementById("quick-journal-view");
    const savedJournalView = document.getElementById("saved-journal-view");

    const journalInput = document.getElementById("journal-input");
    const dashboardSaveBtn = document.getElementById("dashboard-save-journal-btn");
    const input = document.getElementById("dashboard-journal-input");


    /* WELCOME */
    welcomeText.textContent = `Welcome ${user.displayName || user.username}`;

/* INTERESTS */
interestsBox.innerHTML = "";

if (user.interests && user.interests.length > 0) {
    user.interests.forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        interestsBox.appendChild(li);
    });
} else {
    interestsBox.innerHTML = "<li>No interests selected yet</li>";
}

// dashboard final code

const moods = getSavedMoods(user.username);
const today = todayDate();

// Show today's mood on dashboard load
const todayMood = moods.find(m => m.date === today);
if (todayMood && moodStatus) {
    moodStatus.textContent = todayMood.message;
} else if (moodStatus) {
    moodStatus.textContent = "How are you feeling today?";
}
if (todayMood && moodBadge) {
    moodBadge.classList.remove("hidden");
}

// Allow saving mood from dashboard (once per day)
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
            message = "Every moment is a fresh beginning 🌱";
        }

        const saved = saveTodayMood(user.username, mood, message);

        if (saved && moodStatus) {
            moodStatus.textContent = message;
        }
    });
});


    /* JOURNAL */
    function getJournals() {
        return JSON.parse(localStorage.getItem("journals")) || {};
    }

    function saveJournals(data) {
        localStorage.setItem("journals", JSON.stringify(data));
    }

    function renderJournalEntries() {
        if(!journalEntriesBox) return;

        const journals = getJournals();
        const entries = journals[user.username] || [];

        journalEntriesBox.innerHTML = "";

        if (entries.length === 0) {
            journalEntriesBox.innerHTML = "<p>No journal entries yet.</p>";
            return;
        }

        entries.forEach(e => {
            const div = document.createElement("div");
            div.className = "journal-entry";
            div.innerHTML = `<p>${e.text}</p><small>${e.date}</small>`;
            journalEntriesBox.appendChild(div);
        });
    }

    if(saveJournalBtn){
        saveJournalBtn.onclick = () => {
            if(!journalInput) return;

            const text = journalInput.value.trim();
            if (!text) return;

            const journals = JSON.parse(localStorage.getItem("journals")) || {};
            journals[user.username] = journals[user.username] || [];

            journals[user.username].unshift({
            text,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("journals", JSON.stringify(journals));
        journalInput.value = "";

        renderJournalEntries();

        alert("Journal entry saved ✨");
    };

    } 

    if (dashboardSaveBtn) {
        dashboardSaveBtn.onclick = () => {
            const text = input.value.trim();
            if (!text) return;

            const journals = JSON.parse(localStorage.getItem("journals")) || {};
            journals[user.username] = journals[user.username] || [];

            journals[user.username].unshift({
                text,
                date: new Date().toLocaleDateString()
            });

            localStorage.setItem("journals", JSON.stringify(journals));
            input.value = "";

            renderJournalEntries();
            alert("Journal entry saved ✨");
    };
}

    logoutBtn.onclick = logoutUser;
});

