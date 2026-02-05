const signupBox = document.getElementById('signup-box');
const loginBox = document.getElementById('login-box');
const toLogin = document.getElementById('to-login');
const toSignup = document.getElementById('to-signup');

toLogin.onclick = () => { signupBox.classList.add('hidden'); loginBox.classList.remove('hidden'); };
toSignup.onclick = () => { loginBox.classList.add('hidden'); signupBox.classList.remove('hidden'); };

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value; 
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('display-name').value;
    const bio = document.getElementById('bio').value;

    const selectedTags = Array.from(document.querySelectorAll('input[name="tags"]:checked'))
                              .map(cb => cb.value);

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                displayName,
                email, 
                password,
                bio,
                interests: selectedTags
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account Created! 🎉");
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        } else {
            alert(data.msg || "Signup failed!");
        }
    } catch (err) {
        console.error("Signup error:", err);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html'; 
        } else {
            alert(data.msg || "Login failed!");
        }
    } catch (err) {
        console.error("Login error:", err);
    }
});