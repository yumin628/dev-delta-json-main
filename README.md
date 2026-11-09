# ChunkMate
> A simple notebook to save, track, and master conversational English chunks.

## Authorship + Version
- **Author:** Yumin Choi
- **Project:** dev|delta (Updated from dev|bravo)
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
