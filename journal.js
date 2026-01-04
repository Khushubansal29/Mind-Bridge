function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.setItem("showLogin", "true");
    window.location.href = "index.html";
}

const user = getCurrentUser();
if (!user) location.href = "index.html";

/* ELEMENTS */
const journalInput = document.getElementById("journal-input");
const saveBtn = document.getElementById("save-journal-btn");
const journalEntriesBox = document.getElementById("journal-entries");

const btnQuick = document.getElementById("btn-quick-journal");
const btnView = document.getElementById("btn-view-journal");

const quickView = document.getElementById("quick-journal-view");
const savedView = document.getElementById("saved-journal-view");

/* HELPERS */
function getJournals() {
    return JSON.parse(localStorage.getItem("journals")) || {};
}

function saveJournals(data) {
    localStorage.setItem("journals", JSON.stringify(data));
}

function renderJournalEntries() {
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

/* SAVE */
saveBtn.onclick = () => {
    const text = journalInput.value.trim();
    if (!text) return;

    const journals = getJournals();
    journals[user.username] = journals[user.username] || [];

    journals[user.username].unshift({
        text,
        date: new Date().toLocaleDateString()
    });

    saveJournals(journals);
    journalInput.value = "";
    alert("Journal saved ✨");
};

/* TOGGLE */
btnQuick.onclick = () => {
    quickView.classList.remove("hidden");
    savedView.classList.add("hidden");
};

btnView.onclick = () => {
    savedView.classList.remove("hidden");
    quickView.classList.add("hidden");
    renderJournalEntries();
};

document.getElementById("logout-btn").onclick = logoutUser;
