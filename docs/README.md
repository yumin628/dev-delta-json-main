# ChunkMate
> A simple notebook to save, track, and master conversational English chunks.

## Authorship + Version
- **Author:** Yumin Choi
- **Project:** `dev|delta` (Updated from dev|bravo)
- **Version:** 0.2
- **Date:** 2026-11

## User Story & Narrative
International students often hear natural, useful English phrases in class or conversations, but easily forget them if they aren't written down immediately. **ChunkMate** is a web app designed to solve this problem by providing a quick, accessible interface to log new English "chunks", their meanings, and a status checkbox (memorized/learning).

While `dev|bravo` established the front-end interface, this `dev|delta` version brings the application to life. It replaces hardcoded HTML with structured JSON data, implements an authentication system (AuthN), and enforces role-based authorization (AuthZ).

## Current Functionality (dev|delta)
- **AuthN:** Functional sign-in system using fetched credentials.
- **AuthZ:** Role-based access control. Admin users can access the Admin Dashboard and delete records. Regular users cannot.
- **Data (READ):** App content is fetched from a structured local `data.json` file and rendered dynamically.
- **CRUD:** Users can CREATE new chunks and UPDATE memorization status. Admins can DELETE chunks.
- **Session Storage:** The complete Application State (`appState`), including user data and chunk records, is saved to `sessionStorage` and survives page refreshes.
- **Admin Area:** A dedicated dashboard displaying the current user, session info, and a full JSON dump of the `appState`.

## Test Accounts
```text
ADMIN
username: admin@una.edu
password: password

USER
username: student@una.edu
password: password
```

## Data Flow Diagram
```text
AUTH (users.json) ─────┐
                       │
STATIC JSON ──fetch()──┼──→ APP STATE (appState)
                       │       ↓
USER INPUT (Forms) ────┘   sessionStorage
                               ↓
                              DOM (UI Render)
```

## Technology Stack
`HTML5` | `CSS3` | `JavaScript (ES6, async/await, fetch)` | `Bootstrap 5` | `JSON` | `sessionStorage`

## Project Structure
```text
dev-delta/
├── index.html
├── pages/
│   ├── signin.html
│   └── admin.html
├── assets/
│   ├── data/
│   │   ├── data.json
│   │   └── users.json
│   ├── styles/
│   │   └── style.css
│   └── scripts/
│       └── app.js
└── README.md
```
## ECHO Deployment
- **GitHub Repository:** [https://github.com/yumin628/dev-delta-json-main](https://github.com/yumin628/dev-delta-json-main)
- **GitHub Pages (Docs):** [https://yumin628.github.io/dev-delta-json-main/](https://yumin628.github.io/dev-delta-json-main/)
- **Production App (GCP HTTPS):** [https://yumin.barrycumbie.com](https://yumin.barrycumbie.com)
- **GCP External IP:** 34.9.197.253

### Deployment Summary
Deployed the ChunkMate (`dev|delta`) static front-end application to an existing Google Cloud Platform Debian VM served by Nginx with HTTPS (Let's Encrypt / Certbot). Replaced the previous demo files in `/var/www/html/` with the `dev-delta-json-main` repository.

### Linux Commands Used
- `rm -rf ~/app`
- `git clone https://github.com/yumin628/dev-delta-json-main.git app`
- `sudo rm -rf /var/www/html/*`
- `sudo cp -a ~/app/. /var/www/html/`
- `curl -I http://localhost`

### SSH Access Verification
- Verified direct local SSH key authentication to the GCP VM (`whoami`, `hostname`, `pwd`).
- **Verification Issue:** [ECHO DEV: SSH Access Verified](https://github.com/yumin628/dev-delta-json-main/issues/1)