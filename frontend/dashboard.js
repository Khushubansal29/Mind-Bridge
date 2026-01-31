
// function getCurrentUser() {
//     const user = localStorage.getItem("currentUser");
//     return user ? JSON.parse(user) : null;
// }

// function logoutUser() {
//     localStorage.removeItem("currentUser");
//     localStorage.setItem("showLogin", "false");
//     window.location.href = "index.html";
// }

// // mood logic
// function todayDate() { 
//     return new Date().toISOString().split("T")[0]; 
// }

// function getMoodKey(username) { 
//     return `moods_${username}`; 
// }

// function getSavedMoods(username) { 
//     return JSON.parse(localStorage.getItem(getMoodKey(username))) || []; 
// }

// function saveMoods(username, moods) { 
//     localStorage.setItem(getMoodKey(username), JSON.stringify(moods)); 
// }

// function saveOrUpdateTodayMood(username, mood, message) {
//     const moods = getSavedMoods(username);
//     const today = todayDate();
//     const existingMood = moods.find(m => m.date === today);

//     if (existingMood) {
//         existingMood.mood = mood;
//         existingMood.message = message;
//     } else {
//         moods.unshift({ date: today, mood, message });
//     }
//     saveMoods(username, moods);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const user = getCurrentUser();
//     if (!user) { 
//         window.location.href = "index.html"; 
//         return; 
//     }


//     const navAvatar = document.getElementById("nav-avatar");
//     if (navAvatar) {
//         const pic = localStorage.getItem(`profilePic_${user.username}`);
//         if (pic) {
//             navAvatar.innerHTML = `<img src="${pic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
//         } else {
        
//             navAvatar.textContent = (user.displayName || user.username)[0].toUpperCase();
//             navAvatar.style.display = "flex";
//             navAvatar.style.alignItems = "center";
//             navAvatar.style.justifyContent = "center";
//         }
//     }

//     // Logout button handler for all possible IDs
//     const logoutBtnIds = ["direct-logout-btn", "logout-btn"];
//     logoutBtnIds.forEach(id => {
//         const btn = document.getElementById(id);
//         if (btn) {
//             btn.onclick = (e) => {
//                 e.preventDefault();
//                 logoutUser();
//             };
//         }
//     });

//     const welcomeText = document.getElementById("welcome-text");
//     if (welcomeText) welcomeText.textContent = `Welcome ${user.displayName || user.username}!`;

//     function initializeDefaultCircles() {
//         let allCircles = JSON.parse(localStorage.getItem("circles")) || [];
//         if (allCircles.length === 0) {
//             allCircles = [
//                 { id: 101, title: "Healing Space", description: "A safe circle for emotional healing and support.", tags: ["Healing"], members: ["admin"], posts: [] },
//                 { id: 102, title: "Productivity Hub", description: "Focus on your goals and stay motivated together.", tags: ["Productivity"], members: ["admin"], posts: [] },
//                 { id: 103, title: "Mindfulness Daily", description: "Practicing meditation and staying present.", tags: ["Mindfulness"], members: ["admin"], posts: [] }
//             ];
//             localStorage.setItem("circles", JSON.stringify(allCircles));
//         }
//         return allCircles;
//     }

//     const allCircles = initializeDefaultCircles();

//     const recommendedCard = Array.from(document.querySelectorAll(".card"))
//         .find(card => card.querySelector("h2")?.textContent === "Recommended Circles");

//     if (recommendedCard) {
//         recommendedCard.innerHTML = `<h2>Recommended Circles</h2><p class="muted-text">Suggested for you:</p>`;
//         const matchedCircles = allCircles.filter(circle => 
//             circle.tags.some(tag => (user.interests || []).includes(tag))
//         );
//         const displayCircles = matchedCircles.length > 0 ? matchedCircles : allCircles.slice(0, 2);
        
//         const ul = document.createElement("ul");
//         ul.className = "recommended-list";
//         displayCircles.forEach(circle => {
//             const li = document.createElement("li");
//             li.style.padding = "10px 0";
//             li.style.borderBottom = "1px solid #eee";
//             li.innerHTML = `<strong>${circle.title}</strong> <button onclick="location.href='circles.html'" style="float:right; color:#e15b85; background:none; border:none; cursor:pointer; font-weight:bold;">Join →</button>`;
//             ul.appendChild(li);
//         });
//         recommendedCard.appendChild(ul);
//     }

//     const moodButtons = document.querySelectorAll(".mood-btn");
//     const moodStatus = document.getElementById("mood-status");
//     const moodBadge = document.getElementById("mood-saved-badge");

//     moodButtons.forEach(btn => {
//         btn.onclick = () => {
//             let moodType = "";
//             let msg = "";

//             if (btn.textContent.includes("Good")) {
//                 moodType = "Good";
//                 msg = "Peace begins with a smile 😊";
//             } else if (btn.textContent.includes("Neutral")) {
//                 moodType = "Neutral";
//                 msg = "Keep going, you're doing great! 💪🏻";
//             } else {
//                 moodType = "Bad";
//                 msg = "It's okay to not be okay. Fresh start tomorrow 🌱";
//             }

//             saveOrUpdateTodayMood(user.username, moodType, msg);
//             if (moodStatus) moodStatus.textContent = msg;
//             if (moodBadge) {
//                 moodBadge.textContent = "✔ Today's mood saved";
//                 moodBadge.classList.remove("hidden");
//             }
//         };
//     });


//     const quickSaveBtn = document.getElementById("dashboard-save-journal-btn");
//     const quickTitleInput = document.getElementById("dashboard-journal-title");
//     const quickContentInput = document.getElementById("dashboard-journal-input");

//     if (quickSaveBtn) {
//         quickSaveBtn.onclick = () => {
//             const text = quickContentInput.value.trim();
//             const title = quickTitleInput.value.trim() || "Quick Dashboard Entry";

//             if (!text) {
//                 alert("Please write something first! ✍️");
//                 return;
//             }

//             const storageKey = `journals_${user.username}`;
//             const entries = JSON.parse(localStorage.getItem(storageKey)) || [];

//             entries.unshift({
//                 id: Date.now(),
//                 title: title,
//                 text: text,
//                 date: new Date().toLocaleDateString(),
//                 time: new Date().toLocaleTimeString(),
//                 visibility: "private"
//             });

//             localStorage.setItem(storageKey, JSON.stringify(entries));
//             alert("Journal entry saved and synced! 📖✨");
            
//             quickTitleInput.value = "";
//             quickContentInput.value = "";
//         };
//     }

//     const interestsBox = document.getElementById("interest-tags");
//     if (interestsBox) {
//         interestsBox.innerHTML = "";
//         if (user.interests && user.interests.length > 0) {
//             user.interests.forEach(interest => {
//                 const li = document.createElement("li");
//                 li.textContent = interest;
//                 interestsBox.appendChild(li);
//             });
//         } else {
//             interestsBox.innerHTML = "<li>No interests selected yet</li>";
//         }
//     }
// });


// backend wala code:

// --- HELPER FUNCTIONS ---
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

function logoutUser() {
    localStorage.clear(); // Saara data (including token) saaf karo
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = getCurrentUser();
    const token = localStorage.getItem("token"); // Entry Pass nikalo 🎫

    if (!user || !token) { 
        window.location.href = "index.html"; 
        return; 
    }

    const API_BASE = "http://localhost:5000/api";

    // Welcome Text
    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText) welcomeText.textContent = `Welcome ${user.displayName}!`;

    // --- MOOD LOG LOGIC (Essential Feature 2) ---
    const moodButtons = document.querySelectorAll(".mood-btn");
    const moodStatus = document.getElementById("mood-status");
    const moodBadge = document.getElementById("mood-saved-badge");

    moodButtons.forEach(btn => {
        btn.onclick = async () => {
            let status = "";
            let msg = "";

            if (btn.textContent.includes("Good")) {
                status = "Good Day";
                msg = "Peace begins with a smile 😊";
            } else if (btn.textContent.includes("Neutral")) {
                status = "Neutral Day";
                msg = "Keep going, you're doing great! 💪🏻";
            } else {
                status = "Bad Day";
                msg = "It's okay to not be okay. Fresh start tomorrow 🌱";
            }

            try {
                const response = await fetch(`${API_BASE}/mood/add`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "x-auth-token": token // Security Guard ko token dikhao 🛡️
                    },
                    body: JSON.stringify({ status })
                });

                const data = await response.json();

                if (response.ok) {
                    if (moodStatus) moodStatus.textContent = msg;
                    if (moodBadge) {
                        moodBadge.textContent = "✔ Today's mood saved in Database";
                        moodBadge.classList.remove("hidden");
                    }
                } else {
                    alert(data.msg); // E.g., "Aaj ka mood pehle hi set hai!"
                }
            } catch (err) {
                console.error("Mood Error:", err);
            }
        };
    });

    // --- QUICK JOURNAL SAVE (Essential Feature 4) ---
    const quickSaveBtn = document.getElementById("dashboard-save-journal-btn");
    const quickTitleInput = document.getElementById("dashboard-journal-title");
    const quickContentInput = document.getElementById("dashboard-journal-input");

    if (quickSaveBtn) {
        quickSaveBtn.onclick = async () => {
            const bodyText = quickContentInput.value.trim();
            const titleText = quickTitleInput.value.trim() || "Quick Dashboard Entry";

            if (!bodyText) return alert("Kuch toh likho! ✍️");

            try {
                const response = await fetch(`${API_BASE}/journal/add`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "x-auth-token": token 
                    },
                    body: JSON.stringify({
                        title: titleText,
                        body: bodyText,
                        visibility: "Private"
                    })
                });

                if (response.ok) {
                    alert("Journal entry saved to Cloud! 📖✨");
                    quickTitleInput.value = "";
                    quickContentInput.value = "";
                }
            } catch (err) {
                console.error("Journal Error:", err);
            }
        };
    }

    // Logout logic
    const logoutBtn = document.getElementById("logout-btn") || document.getElementById("direct-logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            logoutUser();
        };
    }
});