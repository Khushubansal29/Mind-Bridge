🌿 MindBridge - Mental Wellness Companion
MindBridge is a holistic mental wellness platform designed to help users track their emotional journey, maintain personal journals, and connect with supportive communities.

🚀 Features
1. Mood Tracker
Daily Tracking: Log your mood (Good, Neutral, Bad) with one click.

Visual Analytics: View a summary of your emotional trends (Overview).

Mood History: A chronological log of your past entries to identify patterns.

2. Support Circles
Discovery: Explore various sanctuaries like "Healing Space" or "Productivity Hub".

Real-time Feed: Join a circle and share posts with other members in a dedicated feed.

Create Your Own: Users can build their own niche communities with custom tags.

3. Personal Journal * Private Reflections: A safe space to write down thoughts and feelings.
Local Storage: All entries are saved locally on your device for maximum privacy.

4. User Profiles
Custom Avatars: Support for profile picture uploads or auto-generated letter avatars.

Secure Session: Simple login/logout flow using LocalStorage.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Modern Flexbox/Grid).

Scripting: Vanilla JavaScript (ES6+).

Database: Browser localStorage for persistent data management.

📂 Project Structure
Plaintext

├── index.html          # Authentication/Login Page
├── dashboard.html      # Main User Hub
├── circles.html        # Community Discovery & Feed
├── mood.html           # Mood Tracking Interface
├── js/
│   ├── circles.js      # Circle & Feed Logic
│   └── mood.js         # Mood Stats & UI Logic
└── css/
    └── circles.css     # Cleaned styles for Community
⚙️ Installation & Usage
Clone the repository:

Bash

git clone https://github.com/yourusername/mindbridge.git
Open in Browser: Simply open index.html in any modern web browser. No server setup required!

🔒 Privacy Note
MindBridge values your privacy. Since it uses localStorage, all your journals, moods, and posts stay on your machine and are never sent to a central server.