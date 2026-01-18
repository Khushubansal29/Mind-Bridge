
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function getJournals() {
    const user = getCurrentUser();
    return JSON.parse(localStorage.getItem(`journals_${user.username}`)) || [];
}

function saveJournals(journals) {
    const user = getCurrentUser();
    localStorage.setItem(`journals_${user.username}`, JSON.stringify(journals));
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.setItem("showLogin", "true");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const journalTitleInput = document.getElementById("journal-title");
    const journalInput = document.getElementById("journal-input");
    const saveBtn = document.getElementById("save-journal-btn");
    const journalEntriesBox = document.getElementById("journal-entries");
    
    const circleSelectBox = document.getElementById("journal-circle-select");
    const circleOptionsBox = document.getElementById("journal-circle-options");

    const btnQuick = document.getElementById("btn-quick-journal");
    const btnView = document.getElementById("btn-view-journal");
    const quickView = document.getElementById("quick-journal-view");
    const savedView = document.getElementById("saved-journal-view");

    function renderJournalEntries() {
        if (!journalEntriesBox) return;

        const entries = getJournals();
        journalEntriesBox.innerHTML = "";

        if (entries.length === 0) {
            journalEntriesBox.innerHTML = `
                <div class="card center muted-text" style="padding: 20px;">
                    No journal entries yet. Start writing your thoughts! ✨
                </div>`;
            return;
        }

        entries.forEach(entry => {
            const div = document.createElement("div");
            div.className = "card journal-card animate-in";
            div.style.marginBottom = "15px";
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="color: var(--primary-btn); margin-bottom: 5px;">${entry.title}</h3>
                    <small class="muted-text">${entry.date}</small>
                </div>
                <p style="color: #555; line-height: 1.5;">${entry.text}</p>
                ${entry.visibility === 'circle' ? `<div class="tag-badge small">Shared with Circles</div>` : ''}
            `;
            journalEntriesBox.appendChild(div);
        });
    }

    const allCircles = JSON.parse(localStorage.getItem("circles")) || [];
    const myCircles = allCircles.filter(c => c.members?.includes(user.username));

    if (circleOptionsBox) {
        circleOptionsBox.innerHTML = "";
        myCircles.forEach(circle => {
            const label = document.createElement("label");
            label.className = "checkbox-pill"; 
            label.innerHTML = `
                <input type="checkbox" value="${circle.id}">
                <span>${circle.title}</span>
            `;
            circleOptionsBox.appendChild(label);
        });
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            const title = journalTitleInput.value.trim() || "Untitled Entry";
            const text = journalInput.value.trim();

            if (!text) {
                alert("Please write something in your journal first! ✍️");
                return;
            }

            const visibilityRadios = document.querySelectorAll('input[name="journal-visibility"]');
            const visibility = Array.from(visibilityRadios).find(r => r.checked)?.value || "private";

            const selectedCircles = visibility === "circle" 
                ? Array.from(circleOptionsBox.querySelectorAll("input:checked")).map(cb => cb.value)
                : [];

            if (visibility === "circle" && selectedCircles.length === 0) {
                alert("Please select at least one circle to share with.");
                return;
            }

            // Save Entry
            const entries = getJournals();
            entries.unshift({
                id: Date.now(),
                title: title,
                text: text,
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                visibility: visibility,
                circles: selectedCircles
            });

            saveJournals(entries);

            // Success & Reset
            alert("Journal saved successfully! 📖✨");
            
            // Clear inputs
            journalTitleInput.value = "";
            journalInput.value = "";
            if (circleSelectBox) circleSelectBox.classList.add("hidden");
            document.querySelectorAll('input[name="journal-visibility"]').forEach(r => r.checked = r.value === 'private');
            
            // Switch to view
            btnView.click();
        };
    }

    if (btnQuick) {
        btnQuick.onclick = () => {
            quickView.classList.remove("hidden");
            savedView.classList.add("hidden");
            btnQuick.classList.add("active");
            btnView.classList.remove("active");
        };
    }

    if (btnView) {
        btnView.onclick = () => {
            savedView.classList.remove("hidden");
            quickView.classList.add("hidden");
            btnView.classList.add("active");
            btnQuick.classList.remove("active");
            renderJournalEntries();
        };
    }

    document.querySelectorAll('input[name="journal-visibility"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "circle") {
                circleSelectBox?.classList.remove("hidden");
            } else {
                circleSelectBox?.classList.add("hidden");
            }
        });
    });

    const navAvatar = document.getElementById("nav-avatar");
    const avatarBtn = document.getElementById("avatar-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("logout-btn");

    if (user && navAvatar) {
        const pic = localStorage.getItem(`profilePic_${user.username}`);
        if (pic) {
            navAvatar.innerHTML = `<img src="${pic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" />`;
        } else {
            navAvatar.textContent = (user.displayName || user.username)[0].toUpperCase();
        }
    }

    avatarBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown?.classList.toggle("hidden");
    });

    document.addEventListener("click", () => profileDropdown?.classList.add("hidden"));

    if (logoutBtn) logoutBtn.onclick = logoutUser;

    // Initial Render
    renderJournalEntries();
});

// Direct Logout Logic
const directLogoutBtn = document.getElementById("direct-logout-btn");

if (directLogoutBtn) {
    directLogoutBtn.onclick = () => {
        // Clear session
        localStorage.removeItem("currentUser");
        
        // Show login form 
        localStorage.setItem("showLogin", "true");
        
        // Redirect to Auth/Index page
        window.location.href = "index.html";
    };
}