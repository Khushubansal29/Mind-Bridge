
function getCircles() {
    let data = JSON.parse(localStorage.getItem("circles"));
    if (!data || data.length === 0) {
        const defaultCircles = [
            { id: 101, title: "Healing Space", description: "A safe circle for emotional healing and support.", tags: ["Healing"], members: ["admin"], posts: [] },
            { id: 102, title: "Productivity Hub", description: "Focus on your goals and stay motivated together.", tags: ["Productivity"], members: ["admin"], posts: [] },
            { id: 103, title: "Mindfulness Daily", description: "Practicing meditation and staying present.", tags: ["Mindfulness"], members: ["admin"], posts: [] }
        ];
        localStorage.setItem("circles", JSON.stringify(defaultCircles));
        return defaultCircles;
    }
    return data;
}

function saveCircles(data) {
    localStorage.setItem("circles", JSON.stringify(data));
}


document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) { window.location.href = "index.html"; return; }

    
    const navAvatar = document.getElementById("nav-avatar");
    if (navAvatar) {
        const pic = localStorage.getItem(`profilePic_${user.username}`);
        if (pic) {
            navAvatar.innerHTML = `<img src="${pic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            navAvatar.textContent = (user.displayName || user.username)[0].toUpperCase();
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

    let currentFilter = "All"; 
    const grid = document.getElementById("circles-grid");
    const searchInput = document.getElementById("circle-search");
    const filterButtons = document.querySelectorAll(".filter-btn");

    
    function renderDiscovery() {
        const circles = getCircles();
        const term = searchInput ? searchInput.value.toLowerCase() : "";
        if(!grid) return;
        grid.innerHTML = "";

        const filtered = circles.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(term);
            const matchesTag = (currentFilter === "All") || 
                               c.tags.some(t => t.toLowerCase() === currentFilter.toLowerCase());
            return matchesSearch && matchesTag;
        });

        filtered.forEach(circle => {
            const isMember = circle.members.includes(user.username);
            const card = document.createElement("div");
            card.className = "card circle-item";
            card.innerHTML = `
                <span class="tag-badge">${circle.tags[0]}</span>
                <h3 style="margin-top:10px; text-transform: capitalize;">${circle.title}</h3>
                <p class="muted-text">${circle.description}</p>
                <div class="circle-card-footer">
                    <small>${circle.members.length} members</small>
                    <button class="${isMember ? 'btn-primary' : 'btn-secondary'} small ${isMember ? 'open-feed' : 'join-btn'}" data-id="${circle.id}">
                        ${isMember ? 'Enter' : 'Join'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    
    const postBtn = document.getElementById("post-to-feed-btn");
    const postTitleInput = document.getElementById("post-title-input");
    const postContentInput = document.getElementById("post-content-input");

    if (postBtn) {
        postBtn.onclick = () => {
            const title = postTitleInput.value.trim();
            const content = postContentInput.value.trim();

            if (!title || !content) {
                alert("Please write something before posting!");
                return;
            }

            if (window.activeCircle) {
                let circles = getCircles();
                const circleIdx = circles.findIndex(c => c.id == window.activeCircle.id);
                
                const newPost = {
                    id: Date.now(),
                    username: user.username,
                    displayName: user.displayName || user.username,
                    title: title,
                    content: content,
                    timestamp: new Date().toLocaleString()
                };

                circles[circleIdx].posts.unshift(newPost);
                saveCircles(circles);
                window.activeCircle = circles[circleIdx]; // Sync active circle

                // Clear inputs
                postTitleInput.value = "";
                postContentInput.value = "";

                // Refresh the feed display
                renderFeedPosts(window.activeCircle.posts);
            }
        };
    }

    function renderFeedPosts(posts) {
        const feedContainer = document.getElementById("feed-posts-list");
        if (!feedContainer) return;
        
        feedContainer.innerHTML = "";
        if (posts.length === 0) {
            feedContainer.innerHTML = "<p class='muted-text'>No posts yet. Be the first to share!</p>";
            return;
        }

        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post-item";
            postDiv.innerHTML = `
                <div class="post-header">
                    <div class="post-user-info">
                        <strong>${post.displayName}</strong>
                        <span class="post-timestamp">${post.timestamp}</span>
                    </div>
                </div>
                <div class="post-content">
                    <h4 style="color: var(--highlight); margin-bottom: 5px;">${post.title}</h4>
                    <p>${post.content}</p>
                </div>
            `;
            feedContainer.appendChild(postDiv);
        });
    }

    function openCircleFeed(id) {
        const circles = getCircles();
        window.activeCircle = circles.find(c => c.id == id);
        document.getElementById("discovery-view").classList.add("hidden");
        document.getElementById("feed-view").classList.remove("hidden");
        document.getElementById("active-circle-title").textContent = window.activeCircle.title;
        renderFeedPosts(window.activeCircle.posts);
    }


    grid.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (!id) return;
        if (e.target.classList.contains("join-btn")) {
            let circles = getCircles();
            const idx = circles.findIndex(c => c.id == id);
            circles[idx].members.push(user.username);
            saveCircles(circles);
            renderDiscovery();
        } else if (e.target.classList.contains("open-feed")) {
            openCircleFeed(id);
        }
    });

    filterButtons.forEach(btn => {
        btn.onclick = () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-tag");
            renderDiscovery();
        };
    });

    if (searchInput) searchInput.oninput = renderDiscovery;

    const backBtn = document.getElementById("back-to-discovery");
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById("discovery-view").classList.remove("hidden");
            document.getElementById("feed-view").classList.add("hidden");
        };
    }

    // Create Modal Logic
    const modal = document.getElementById("create-modal");
    const openModalBtn = document.getElementById("open-create-modal");
    const closeModalBtn = document.getElementById("close-create-modal");
    const saveCircleBtn = document.getElementById("save-circle-btn");

    if (openModalBtn) openModalBtn.onclick = () => modal.classList.remove("hidden");
    if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.add("hidden");

    if (saveCircleBtn) {
        saveCircleBtn.onclick = () => {
            const name = document.getElementById("new-circle-name").value.trim();
            const desc = document.getElementById("new-circle-desc").value.trim();
            if (!name || !desc) return;
            const circles = getCircles();
            circles.push({
                id: Date.now(), title: name, description: desc,
                tags: [currentFilter === "All" ? "Healing" : currentFilter],
                members: [user.username], posts: []
            });
            saveCircles(circles);
            modal.classList.add("hidden");
            renderDiscovery();
        };
    }

    renderDiscovery();
});