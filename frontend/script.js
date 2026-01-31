// // helper functions
// function getUsers() {
//     return JSON.parse(localStorage.getItem("allUsers")) || [];
// }

// function saveUsers(users) {
//     localStorage.setItem("allUsers", JSON.stringify(users));
// }

// function setCurrentUser(user) {
//     localStorage.setItem("currentUser", JSON.stringify(user));
// }

// function getCurrentUser() {
//     try {
//         return JSON.parse(localStorage.getItem("currentUser"));
//     } catch {
//         return null;
//     }
// }

// // DOM

// document.addEventListener("DOMContentLoaded", function () {

//     const signupBox = document.getElementById("signup-box");
//     const loginBox = document.getElementById("login-box");

//     const showLogin = localStorage.getItem("showLogin");

//     if (showLogin === "true") {
//         signupBox.classList.add("hidden");
//         loginBox.classList.remove("hidden");

//         localStorage.removeItem("showLogin");
//     }

//     const toLoginLink = document.getElementById("to-login");
//     const toSignupLink = document.getElementById("to-signup");

//     const signupForm = document.getElementById("signup-form");
//     const loginForm = document.getElementById("login-form");

//     // toggle

//     if (toLoginLink) {
//         toLoginLink.addEventListener("click", function (e) {
//             e.preventDefault();
//             signupBox.classList.add("hidden");
//             loginBox.classList.remove("hidden");
//         });
//     }

//     if (toSignupLink) {
//         toSignupLink.addEventListener("click", function (e) {
//             e.preventDefault();
//             loginBox.classList.add("hidden");
//             signupBox.classList.remove("hidden");
//         });
//     }

//     // signup
//     if (signupForm) {
//         signupForm.addEventListener("submit", function (e) {
//             e.preventDefault();

//             const newUser = {
//                 username: document.getElementById("username").value.trim(),
//                 password: document.getElementById("password").value,
//                 displayName: document.getElementById("display-name").value.trim(),
//                 bio: document.getElementById("bio").value.trim(),
//                 interests: Array.from(
//                     document.querySelectorAll('input[name="tags"]:checked')
//                 ).map(function (tag) {
//                     return tag.value;
//                 })
//             };

//             if (!newUser.username || !newUser.password || !newUser.displayName) {
//                 alert("Please fill all required fields.");
//                 return;
//             }

//             const users = getUsers();

//             const userExists = users.some(function (user) {
//                 return user.username === newUser.username;
//             });

//             if (userExists) {
//                 alert("Username already exists!");
//                 return;
//             }

//             users.push(newUser);
//             saveUsers(users);

//             alert("Account created! Please log in.");

//             signupForm.reset();
//             signupBox.classList.add("hidden");
//             loginBox.classList.remove("hidden");
//         });
//     }

// //    login
//     if (loginForm) {
//         loginForm.addEventListener("submit", function (e) {
//             e.preventDefault();

//             const usernameInput =
//                 document.getElementById("login-username").value.trim();
//             const passwordInput =
//                 document.getElementById("login-password").value;

//             const users = getUsers();

//             const foundUser = users.find(function (user) {
//                 return (
//                     user.username === usernameInput &&
//                     user.password === passwordInput
//                 );
//             });

//             if (!foundUser) {
//                 alert("Invalid username or password.");
//                 return;
//             }

//             setCurrentUser(foundUser);
//             window.location.href = "dashboard.html";
//         });
//     }

// });



// backend wala code:

document.addEventListener("DOMContentLoaded", function () {
    const signupBox = document.getElementById("signup-box");
    const loginBox = document.getElementById("login-box");
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Base URL for our Backend
    const API_URL = "http://localhost:5000/api/auth";

    // --- SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const newUser = {
                // Humne backend mein 'email' use kiya tha, toh yahan username ko email map karenge
                email: document.getElementById("username").value.trim(), 
                password: document.getElementById("password").value,
                displayName: document.getElementById("display-name").value.trim(),
                bio: document.getElementById("bio").value.trim(),
                interests: Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value)
            };

            try {
                const response = await fetch(`${API_URL}/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Account created! 🎉 Ab login kijiye.");
                    signupForm.reset();
                    signupBox.classList.add("hidden");
                    loginBox.classList.remove("hidden");
                } else {
                    alert(data.msg || "Signup failed! 🧐");
                }
            } catch (err) {
                console.error("Backend offline hai shayad:", err);
            }
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const loginData = {
                email: document.getElementById("login-username").value.trim(),
                password: document.getElementById("login-password").value
            };

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Token save karna bohot zaroori hai! 🎫
                    localStorage.setItem("token", data.token); 
                    localStorage.setItem("currentUser", JSON.stringify(data.user));
                    
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.msg || "Invalid credentials! ❌");
                }
            } catch (err) {
                console.error("Login error:", err);
            }
        });
    }

    // Toggle Logic (Same as before)
    const toLoginLink = document.getElementById("to-login");
    const toSignupLink = document.getElementById("to-signup");
    if (toLoginLink) {
        toLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            signupBox.classList.add("hidden");
            loginBox.classList.remove("hidden");
        });
    }
    if (toSignupLink) {
        toSignupLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginBox.classList.add("hidden");
            signupBox.classList.remove("hidden");
        });
    }
});