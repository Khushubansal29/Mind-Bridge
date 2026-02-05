document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupMoodButtons();
});

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();

            document.getElementById('welcome-text').innerText = `Welcome ${userData.displayName}!`;

            const headings = document.querySelectorAll('.card h2, .card h1, #mood-tracker-header');
headings.forEach(h => {
    h.style.color = '#90EE90'; 
});

            const avatar = document.getElementById('nav-avatar');
            if (avatar) {
                if (userData.profilePic && userData.profilePic.startsWith("data:image")) {
                    avatar.innerHTML = `<img src="${userData.profilePic}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    avatar.style.backgroundColor = "transparent"; 
                } else {
                    const initial = userData.displayName ? userData.displayName[0].toUpperCase() : "U";
                    avatar.innerHTML = "";
                    avatar.textContent = initial;
                }
            }

            if (userData.interests && userData.interests.length > 0) {
                renderInterests(userData.interests); 
                renderCircles(userData.interests);
            } else {
                const box = document.getElementById('final-interests-box');
                if(box) box.innerHTML = "<span>No interests found</span>";
            }

            if (userData.moodHistory) {
                checkTodayMood(userData.moodHistory);
            }
        }
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

function setupMoodButtons() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const badge = document.getElementById('mood-saved-badge');
    const statusText = document.getElementById('mood-status');
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const moodValue = btn.innerText.split(' ')[0]; 
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/update-mood', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mood: moodValue })
                });

                if (response.ok) {
                    const updatedData = await response.json();
                    moodBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if(badge) badge.classList.remove('hidden');
                    if(statusText) statusText.innerText = `Feeling ${moodValue} today!`;

                    if (updatedData.moodHistory) {
                        checkTodayMood(updatedData.moodHistory);
                    }
                }
            } catch (error) {
                console.error("Error saving mood:", error);
            }
        });
    });
}

function renderInterests(interests) {
    const container = document.getElementById('final-interests-box');
    if (!container) return;
    container.innerHTML = ''; 

    interests.forEach(item => {
        const span = document.createElement('span');
        span.className = 'pill-label'; 
        span.style.backgroundColor = '#fce4ec'; 
        span.style.color = '#e15b85';         
        span.style.padding = '5px 15px';
        span.style.borderRadius = '20px';
        span.style.marginRight = '10px';
        span.style.marginBottom = '8px';
        span.style.display = 'inline-block';
        span.style.fontSize = '14px';
        span.style.fontWeight = 'bold';
        
        span.innerText = item;
        container.appendChild(span);
    });
}

async function renderCircles(interests) {
    const container = document.getElementById('final-circles-list');
    const token = localStorage.getItem('token');
    if (!container || !token) return;

    container.innerHTML = '<span style="font-size:12px; color: #888;">Refreshing recommendations...</span>';

    try {
        const searchTags = interests.slice(0, 3);

        const promises = searchTags.map(tag => 
            fetch(`http://localhost:5000/api/circle/search?tag=${tag}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json())
        );

        const results = await Promise.all(promises);

        const allMatched = results.flat();
        const uniqueMatches = Array.from(new Set(allMatched.map(c => c._id)))
                                   .map(id => allMatched.find(c => c._id === id));

        container.innerHTML = ''; 

        if (uniqueMatches.length > 0) {
            uniqueMatches.slice(0, 4).forEach(circle => {
                const span = document.createElement('span');
                span.className = 'pill-label';

                Object.assign(span.style, {
                    backgroundColor: '#fce4ec',
                    color: '#e15b85',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    marginRight: '10px',
                    marginBottom: '10px',
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                });

                span.innerText = `# ${circle.title}`;
                span.onclick = () => window.location.href = 'circles.html';
                container.appendChild(span);
            });
        } else {
            container.innerHTML = '<span style="font-size:12px; color: #888;">No circles for these interests yet.</span>';
        }
    } catch (err) {
        console.error("Circle Sync Error:", err);
        container.innerHTML = '<span>Error loading suggestions</span>';
    }
}

function checkTodayMood(history) {
    if (!history || history.length === 0) return;

    const today = new Date().toDateString();
    const lastEntry = history[history.length - 1];
    const entryDate = new Date(lastEntry.date).toDateString();

    if (today === entryDate) {
        const moodBtns = document.querySelectorAll('.mood-btn');
        const badge = document.getElementById('mood-saved-badge');
        const statusText = document.getElementById('mood-status');

        moodBtns.forEach(btn => {
            if (btn.innerText.includes(lastEntry.mood)) {
                btn.classList.add('active');
            }
        });

        if(badge) badge.classList.remove('hidden');
        if(statusText) statusText.innerText = `You already marked your mood as ${lastEntry.mood} today!`;
    }
}

const logoutBtn = document.getElementById("direct-logout-btn");
if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    };
}