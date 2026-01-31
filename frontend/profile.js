function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.setItem("showLogin", "true");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {

    // auth
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    const profilePic = document.getElementById("profile-pic");
    const changePicBtn = document.getElementById("change-pic-btn");
    const picInput = document.getElementById("profile-pic-input");

    const displayNameInput = document.getElementById("display-name");
    const bioInput = document.getElementById("bio");

    const interestCheckboxes = document.querySelectorAll(
        'input[name="profile-interests"]'
    );

    const saveProfileBtn = document.getElementById("save-profile-btn");

    const PROFILE_PIC_KEY = `profilePic_${user.username}`;

    // profile pic
    const savedPic = localStorage.getItem(PROFILE_PIC_KEY);

    if (savedPic) {
        profilePic.src = savedPic;
        profilePic.classList.remove("default-avatar");
        profilePic.textContent = "";
    } else {
        const initial = (user.displayName || user.username)[0].toUpperCase();
        profilePic.src = "";
        profilePic.textContent = initial;
        profilePic.classList.add("default-avatar");
    }

    changePicBtn.addEventListener("click", () => {
        picInput.click();
    });

    picInput.addEventListener("change", () => {
        const file = picInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result;

            profilePic.src = imageData;
            profilePic.textContent = "";
            profilePic.classList.remove("default-avatar");

            localStorage.setItem(PROFILE_PIC_KEY, imageData);
        };

        reader.readAsDataURL(file);
    });

    // load profile data
    displayNameInput.value = user.displayName || "";
    bioInput.value = user.bio || "";

    if (user.interests && user.interests.length > 0) {
        interestCheckboxes.forEach(cb => {
            cb.checked = user.interests.includes(cb.value);
        });
    }

//    save profile
    saveProfileBtn.addEventListener("click", () => {

        const updatedName = displayNameInput.value.trim();
        const updatedBio = bioInput.value.trim();

        const updatedInterests = Array.from(interestCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (!updatedName) {
            alert("Display name cannot be empty");
            return;
        }

        /* update current user */
        user.displayName = updatedName;
        user.bio = updatedBio;
        user.interests = updatedInterests;

        localStorage.setItem("currentUser", JSON.stringify(user));

        /* update allUsers */
        const updatedUsers = allUsers.map(u =>
            u.username === user.username ? user : u
        );

        localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

        alert("Profile updated successfully ✨");
    });

    const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.onclick = logoutUser;
}

});
 
// navbar

const user = JSON.parse(localStorage.getItem("currentUser"));

const avatarBtn = document.getElementById("avatar-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const notifBtn = document.getElementById("notif-btn");
const notifDropdown = document.getElementById("notif-dropdown");
const navAvatar = document.getElementById("nav-avatar");

/* Load avatar */
(function loadAvatar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !navAvatar) return;

    const pic = localStorage.getItem(`profilePic_${user.username}`);

    if (pic) {
        navAvatar.innerHTML = `<img src="${pic}" />`;
    } else {
        navAvatar.textContent = (user.displayName || user.username)[0].toUpperCase();
    }
})();

/* Toggle profile dropdown */
avatarBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("hidden");
    notifDropdown?.classList.add("hidden");
});

/* Toggle notifications */
notifBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("hidden");
    profileDropdown?.classList.add("hidden");
});

document.addEventListener("click", (e) => {
    if (!avatarBtn?.contains(e.target)) {
        profileDropdown?.classList.add("hidden");
    }

    if (!notifBtn?.contains(e.target)) {
        notifDropdown?.classList.add("hidden");
    }
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