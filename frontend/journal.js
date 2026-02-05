document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const API_URL = "http://localhost:5000/api/auth";

    const journalTitleInput = document.getElementById("journal-title");
    const journalInput = document.getElementById("journal-input");
    const saveBtn = document.getElementById("save-journal-btn");
    const journalEntriesBox = document.getElementById("journal-entries");
    const communityEntriesBox = document.getElementById("community-entries");

    const quickView = document.getElementById("quick-journal-view");
    const savedView = document.getElementById("saved-journal-view");
    const communityView = document.getElementById("community-journal-view");

    const btnQuick = document.getElementById("btn-quick-journal");
    const btnSaved = document.getElementById("btn-view-journal");
    const btnCommunity = document.getElementById("btn-community-journal");

    async function syncNavbar() {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const userData = await response.json();

            if (response.ok) {
                const navAvatar = document.getElementById('nav-avatar');
                if (navAvatar && userData.profilePic) {
                    if (userData.profilePic && userData.profilePic.startsWith("data:image")) {
                        navAvatar.innerHTML = `<img src="${userData.profilePic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                        navAvatar.style.backgroundColor = "transparent";
                    } else {
                        const initial = userData.displayName ? userData.displayName[0].toUpperCase() : "U";
                        navAvatar.innerHTML = "";
                        navAvatar.textContent = initial;
                        navAvatar.style.display = "flex";
                        navAvatar.style.alignItems = "center";
                        navAvatar.style.justifyContent = "center";
                        navAvatar.style.backgroundColor = "#e15b85";
                    }
                }
            }
        } catch (err) { console.error("Navbar sync error:", err); }
    }

    async function renderMyJournals() {
        if (!journalEntriesBox) return;
        try {
            const response = await fetch(`${API_URL}/profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const userData = await response.json();
            const entries = userData.journalEntries || [];

            journalEntriesBox.innerHTML = entries.length === 0 
                ? `<div class="card center muted-text">No entries yet. ✨</div>` 
                : "";

            [...entries].reverse().forEach(entry => {
                const div = document.createElement("div");
                div.className = "card journal-card animate-in";
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <h3 style="color: #e15b85;">${entry.title}</h3>
                        <small>${new Date(entry.date).toLocaleDateString()}</small>
                    </div>
                    <p style="color: #555; margin-top: 10px;">${entry.content}</p>
                    <div class="tag-badge small ${entry.visibility === 'Public' ? 'status-public' : 'status-private'}">${entry.visibility}</div>
                `;
                journalEntriesBox.appendChild(div);
            });
        } catch (err) { console.error("Fetch error:", err); }
    }

    async function renderCommunityJournals() {
        if (!communityEntriesBox) return;
        try {
            const response = await fetch(`${API_URL}/public-journals`);
            const publicEntries = await response.json();

            communityEntriesBox.innerHTML = publicEntries.length === 0 
                ? `<div class="card center muted-text">No community journals yet. 🌍</div>` 
                : "";

            publicEntries.forEach(entry => {
                const div = document.createElement("div");
                div.className = "card journal-card animate-in";
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <h3 style="color: #e15b85;">${entry.title}</h3>
                        <small>${new Date(entry.date).toLocaleDateString()}</small>
                    </div>
                    <p style="color: #555; margin-top: 10px;">${entry.content}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                        <span class="tag-badge small status-public">Public</span>
                        <span style="font-size: 0.85rem; font-weight: bold; color: #777;">✍️ By: ${entry.author}</span>
                    </div>
                `;
                communityEntriesBox.appendChild(div);
            });
        } catch (err) { console.error("Community fetch error:", err); }
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const title = journalTitleInput.value.trim() || "Untitled";
            const content = journalInput.value.trim();
            
            if (!content) { alert("Please write something first!"); return; }

            const visibilityRadios = document.querySelectorAll('input[name="journal-visibility"]');
            let visibility = "Private";
            visibilityRadios.forEach(r => { if (r.checked) visibility = r.value.charAt(0).toUpperCase() + r.value.slice(1); });

            try {
                const response = await fetch(`${API_URL}/save-journal`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ title, content, visibility })
                });

                if (response.ok) {
                    alert("Journal saved! 📖✨");
                    journalTitleInput.value = "";
                    journalInput.value = "";
                    btnSaved.click(); 
                } else { alert("Save failed!"); }
            } catch (err) { console.error("Save error:", err); }
        };
    }

    function resetTabs() {
        [quickView, savedView, communityView].forEach(v => v?.classList.add("hidden"));
        [btnQuick, btnSaved, btnCommunity].forEach(b => b?.classList.remove("active"));
    }

    btnQuick.onclick = () => { resetTabs(); quickView.classList.remove("hidden"); btnQuick.classList.add("active"); };
    btnSaved.onclick = () => { resetTabs(); savedView.classList.remove("hidden"); btnSaved.classList.add("active"); renderMyJournals(); };
    btnCommunity.onclick = () => { resetTabs(); communityView.classList.remove("hidden"); btnCommunity.classList.add("active"); renderCommunityJournals(); };

    if (window.location.hash === '#history') { btnSaved.click(); } else { syncNavbar(); renderMyJournals(); }
});

const logoutBtn = document.getElementById("direct-logout-btn");

if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";

        console.log("Logged out successfully. See you soon at MindBridge! ✨");
    };
}