console.log("circles.js loaded ✅");

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5000/api/circle";

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // ================== ELEMENTS ==================
  const grid = document.getElementById("circles-grid");
  const discoveryView = document.getElementById("discovery-view");
  const feedView = document.getElementById("feed-view");

  const searchInput = document.getElementById("circle-search");
  const filterBtns = document.querySelectorAll(".filter-btn");

  const openCreateBtn = document.getElementById("open-create-modal");
  const createModal = document.getElementById("create-modal");
  const closeModalBtn = document.getElementById("close-create-modal");
  const saveCircleBtn = document.getElementById("save-circle-btn");

  const postBtn = document.getElementById("post-to-feed-btn");
  const backBtn = document.getElementById("back-to-discovery");
  const feedList = document.getElementById("feed-posts-list");

  let currentUser = null;
  let currentTag = "All";
  let activeCircleId = null;

  // ================== PROFILE INIT ==================
  async function init() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Auth failed");

      currentUser = data;

      // 🔥 AVATAR SYNC (same as dashboard)
      const avatar = document.getElementById("nav-avatar");
      if (avatar) {
        if (
          currentUser.profilePic &&
          currentUser.profilePic.startsWith("data:image")
        ) {
          avatar.innerHTML = `
            <img src="${currentUser.profilePic}"
                 style="width:100%;height:100%;
                        border-radius:50%;object-fit:cover;">
          `;
          avatar.style.backgroundColor = "transparent";
        } else {
          const initial = currentUser.displayName
            ? currentUser.displayName[0].toUpperCase()
            : "U";
          avatar.innerHTML = "";
          avatar.textContent = initial;
        }
      }

      fetchCircles();
    } catch (err) {
      console.error("Profile error:", err);
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  }

  // ================== FETCH CIRCLES ==================
  async function fetchCircles(query = "") {
    try {
      const res = await fetch(
        `${API_BASE}/search?query=${query}&tag=${currentTag}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const circles = await res.json();
      renderCircles(circles);
    } catch (err) {
      console.error("Fetch circles error:", err);
    }
  }

  // ================== SEARCH ==================
  searchInput?.addEventListener("input", e => {
    fetchCircles(e.target.value.trim());
  });

  // ================== FILTER ==================
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTag = btn.dataset.tag;
      fetchCircles(searchInput.value || "");
    });
  });

  // ================== MODAL OPEN / CLOSE ==================
  openCreateBtn?.addEventListener("click", () => {
    createModal.classList.remove("hidden");
  });

  closeModalBtn?.addEventListener("click", () => {
    createModal.classList.add("hidden");
  });

  // ================== CREATE CIRCLE (FIXED) ==================
  saveCircleBtn?.addEventListener("click", async e => {
    e.preventDefault();
    console.log("SAVE CIRCLE CLICKED ✅");

    const titleEl = document.getElementById("new-circle-name");
    const descEl = document.getElementById("new-circle-desc");

    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    const visibility = document.getElementById("vis-public").checked
      ? "Public"
      : "Private";

    const tag =
      document.querySelector('input[name="circle-tag"]:checked + label')
        ?.innerText || "General";

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          visibility,
          tags: [tag]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Failed to create circle");
        return;
      }

      // reset + close
      titleEl.value = "";
      descEl.value = "";
      createModal.classList.add("hidden");

      fetchCircles();
    } catch (err) {
      console.error("Create error:", err);
    }
  });

  // ================== ENTER CIRCLE ==================
  grid.addEventListener("click", e => {
    const card = e.target.closest(".circle-card");
    if (!card) return;
    openCircle(card.dataset.id);
  });

  function openCircle(id) {
    activeCircleId = id;
    discoveryView.classList.add("hidden");
    feedView.classList.remove("hidden");
    loadPosts();
  }

  // ================== POSTS (PERSISTED) ==================
  function postKey() {
    return `posts_${activeCircleId}`;
  }

  function loadPosts() {
    feedList.innerHTML = "";
    const posts = JSON.parse(localStorage.getItem(postKey())) || [];
    posts.forEach(renderPost);
  }

  function savePost(post) {
    const posts = JSON.parse(localStorage.getItem(postKey())) || [];
    posts.unshift(post);
    localStorage.setItem(postKey(), JSON.stringify(posts));
  }

  function renderPost(post) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.content}</p>
      <small>${post.time}</small>
    `;
    feedList.appendChild(el);
  }

  postBtn?.addEventListener("click", () => {
    if (!activeCircleId) return;

    const titleEl = document.getElementById("post-title-input");
    const contentEl = document.getElementById("post-content-input");

    const title = titleEl.value.trim();
    const content = contentEl.value.trim();

    if (!title || !content) return;

    const post = {
      title,
      content,
      time: new Date().toLocaleString()
    };

    savePost(post);
    loadPosts();

    titleEl.value = "";
    contentEl.value = "";
  });

  // ================== BACK TO CIRCLES ==================
  backBtn?.addEventListener("click", () => {
    activeCircleId = null;
    feedView.classList.add("hidden");
    discoveryView.classList.remove("hidden");
  });

  // ================== RENDER CIRCLES ==================
  function renderCircles(circles) {
    grid.innerHTML = "";

    if (!circles.length) {
      grid.innerHTML = "<p>No circles found.</p>";
      return;
    }

    circles.forEach(circle => {
      const card = document.createElement("div");
      card.className = "card circle-card";
      card.dataset.id = circle._id;

      card.innerHTML = `
        <h3>${circle.title}</h3>
        <p>${circle.description}</p>
        <button class="btn-primary">Enter Circle</button>
      `;

      grid.appendChild(card);
    });
  }

  // ================== LOGOUT ==================
  document.getElementById("direct-logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  // ================== START ==================
  init();
});
