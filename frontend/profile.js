document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const API_URL = "http://localhost:5000/api/auth";

    const profilePicContainer = document.getElementById("profile-pic"); 
    const changePicBtn = document.getElementById("change-pic-btn");
    const picInput = document.getElementById("profile-pic-input");
    const displayNameInput = document.getElementById("display-name");
    const bioInput = document.getElementById("bio");
    const saveProfileBtn = document.getElementById("save-profile-btn");
    const navAvatar = document.getElementById("nav-avatar");
    const interestCheckboxes = document.querySelectorAll('input[name="profile-interests"]');

    function updateAvatarUI(picData, name) {
        const initial = name ? name[0].toUpperCase() : "U";
        
        const applyToElement = (el) => {
            if (!el) return;
            el.innerHTML = ""; 

            if (picData && picData.startsWith("data:image")) {
                el.innerHTML = `<img src="${picData}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;">`;
                el.style.backgroundColor = "transparent";
            } else {

                el.textContent = initial;
                el.style.display = "flex";
                el.style.alignItems = "center";
                el.style.justifyContent = "center";
                el.style.fontWeight = "bold";
                el.style.color = "white";
                el.style.backgroundColor = "#e15b85";
                el.style.fontSize = el.id === "profile-pic" ? "60px" : "18px";
            }
        };

        applyToElement(profilePicContainer);
        applyToElement(navAvatar);
    }

    async function fetchProfile() {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const user = await response.json();
                
                displayNameInput.value = user.displayName || "";
                bioInput.value = user.bio || "";

                if (user.interests) {
                    interestCheckboxes.forEach(cb => {
                        cb.checked = user.interests.includes(cb.value);
                    });
                }

                updateAvatarUI(user.profilePic, user.displayName);
            }
        } catch (err) {
            console.error("Profile load error:", err);
        }
    }

    changePicBtn?.addEventListener("click", () => picInput.click());

    picInput?.addEventListener("change", () => {
        const file = picInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            updateAvatarUI(base64Image, displayNameInput.value);
        };
        reader.readAsDataURL(file);
    });

    saveProfileBtn.addEventListener("click", async () => {
        const imgTag = profilePicContainer.querySelector('img');
        const imageData = imgTag ? imgTag.src : "";

        const payload = {
            displayName: displayNameInput.value.trim(),
            bio: bioInput.value.trim(),
            interests: Array.from(interestCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
            profilePic: imageData 
        };

        if (!payload.displayName) return alert("Name is required!");

        try {
            const response = await fetch(`${API_URL}/update-profile`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Profile Updated Successfully! ✨");
                window.location.reload(); 
            } else {
                alert(data.msg || "Update failed! Check server limits.");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Connection error!");
        }
    });

    const logout = () => {
        localStorage.clear();
        window.location.href = "index.html";
    };
    document.getElementById("direct-logout-btn")?.addEventListener("click", logout);
    document.getElementById("logout-btn")?.addEventListener("click", logout);

    fetchProfile();
});