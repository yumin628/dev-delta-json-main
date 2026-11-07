// 1. DEV TEST ACCOUNTS
console.log(`
[DEV TEST ACCOUNTS]

ADMIN
username: admin@una.edu
password: password

USER
username: student@una.edu
password: password
`);

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Restore app state (refresh protection)
    // ==========================================
    let appState = {
        app: { name: "ChunkMate", version: "0.2" },
        user: { email: null, name: null, authenticated: false, role: null },
        data: []
    };

    const savedState = sessionStorage.getItem('chunkMateState');
    if (savedState) {
        appState = JSON.parse(savedState);
    }

    // ==========================================
    // Phase 1: Login logic (signin.html)
    // ==========================================
    const signinForm = document.querySelector('#signin-form');
    if (signinForm) {
        const loginBtn = document.querySelector('#login-submit-btn');
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const emailInput = document.querySelector('#email-input').value.trim();
            const passwordInput = document.querySelector('#password-input').value.trim();
            
            try {
                const response = await fetch('../assets/data/users.json');
                if (!response.ok) throw new Error("Failed to fetch credentials.");
                
                const users = await response.json();
                const matchedUser = users.find(u => u.email === emailInput && u.password === passwordInput);
                
                if (matchedUser) {
                    appState.user = {
                        email: matchedUser.email,
                        name: matchedUser.name,
                        authenticated: true,
                        role: matchedUser.role
                    };
                    sessionStorage.setItem('chunkMateState', JSON.stringify(appState));
                    console.log(`[AUTH] User authenticated: ${matchedUser.name} | Role: ${matchedUser.role}`);
                    window.location.href = "../index.html";
                } else {
                    alert("Sign-in failed. Please check your credentials.");
                }
            } catch (error) {
                console.error("[AUTH ERROR]", error);
                alert("An error occurred during sign in.");
            }
        });
    }

    // ==========================================
    // Phase 2: Main page (index.html)
    // ==========================================
    const chunkCardsContainer = document.querySelector('#chunk-cards .row');
    
    if (chunkCardsContainer) {
        // 2-1. Update navbar and separate permissions
        if (appState.user.authenticated) {
            const userInfoSpan = document.querySelector('.text-light.me-3');
            const signinBtn = document.querySelector('#nav-signin-btn');
            
            userInfoSpan.innerHTML = `<i class="bi bi-person-circle"></i> ${appState.user.name}`;
            signinBtn.textContent = "Sign Out";
            signinBtn.href = "#";
            signinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.clear();
                window.location.reload();
            });

            if (appState.user.role === 'admin') {
                const adminBtn = document.createElement('a');
                adminBtn.href = "pages/admin.html";
                adminBtn.className = "btn btn-warning btn-sm me-2";
                adminBtn.innerHTML = '<i class="bi bi-shield-lock-fill"></i> Admin Panel';
                signinBtn.parentNode.insertBefore(adminBtn, signinBtn);
            }
        }

        // 2-2. [READ] Data rendering function
        function renderChunks(chunks) {
            chunkCardsContainer.innerHTML = ''; 
            
            chunks.forEach(chunk => {
                let badgeClass = "bg-secondary";
                if(chunk.tag === "Slang") badgeClass = "bg-warning text-dark";
                if(chunk.tag === "Daily Life") badgeClass = "bg-info";
                if(chunk.tag === "Business") badgeClass = "bg-primary";

                // Authentication: Render the delete button (trash) only for admins
                let deleteBtnHTML = '';
                if (appState.user.role === 'admin') {
                    deleteBtnHTML = `<button class="btn btn-sm btn-outline-danger border-0 delete-btn ms-2" data-id="${chunk.id}" title="Admin Delete"><i class="bi bi-trash"></i></button>`;
                }

                const cardHTML = `
                    <div class="col">
                        <div class="card chunk-card h-100 border-0 shadow-sm">
                            <div class="card-body">
                                <span class="badge ${badgeClass} mb-2">${chunk.tag}</span>
                                <h5 class="card-title fw-bold">${chunk.phrase}</h5>
                                <p class="card-text text-muted">${chunk.meaning}</p>
                            </div>
                            <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <small class="text-muted"><i class="bi bi-calendar-event"></i> ${chunk.date}</small>
                                    ${deleteBtnHTML}
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input update-check" type="checkbox" id="check-${chunk.id}" ${chunk.memorized ? 'checked' : ''}>
                                    <label class="form-check-label text-success" for="check-${chunk.id}">Memorized</label>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                chunkCardsContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        }

        // [READ] Load initial data
        async function loadData() {
            try {
                if (appState.data.length === 0) {
                    const response = await fetch('assets/data/data.json');
                    if (!response.ok) throw new Error("Could not load data.json");
                    appState.data = await response.json();
                    sessionStorage.setItem('chunkMateState', JSON.stringify(appState));
                    console.log("[DATA] Loaded starting data.");
                }
                renderChunks(appState.data);
            } catch (error) {
                console.error("[DATA ERROR]", error);
            }
        }
        loadData();

        // 2-3. [CREATE] Add a new chunk
        const addForm = document.querySelector('#add-chunk-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (!appState.user.authenticated) {
                    alert("Please sign in to add new chunks.");
                    return;
                }

                const phraseInput = document.querySelector('#chunk-input').value.trim();
                const meaningInput = document.querySelector('#meaning-input').value.trim();
                const tagSelect = document.querySelector('#tag-input').value; // slang, business, daily

                // Guard against empty values
                if (!phraseInput || !meaningInput) {
                    alert("Please fill in both the phrase and meaning.");
                    return;
                }

                const tagMap = { "slang": "Slang", "business": "Business", "daily": "Daily Life" };
                const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                const newChunk = {
                    id: Date.now(), // Generate a unique ID that does not overlap
                    phrase: phraseInput,
                    meaning: meaningInput,
                    tag: tagMap[tagSelect],
                    date: today,
                    memorized: false
                };

                appState.data.unshift(newChunk); // Add the new data to the beginning of the array
                sessionStorage.setItem('chunkMateState', JSON.stringify(appState));
                console.log(`[CREATE] record added: ${newChunk.phrase}`);

                renderChunks(appState.data); // Re-render the screen

                // Show success toast and reset form
                const toastElement = document.getElementById('success-toast');
                if (toastElement) {
                    new bootstrap.Toast(toastElement).show();
                }
                addForm.reset();
            });
        }

        // 2-4. [UPDATE & DELETE] Save checkbox state & admin delete functionality
        chunkCardsContainer.addEventListener('click', (e) => {
            
            // DELETE: when the trash button is clicked
            if (e.target.closest('.delete-btn')) {
                const btn = e.target.closest('.delete-btn');
                const chunkId = Number(btn.dataset.id);

                if (appState.user.role !== 'admin') {
                    alert("Not authorized to delete.");
                    return;
                }

                // Create a new array excluding the data with the matching ID
                appState.data = appState.data.filter(c => c.id !== chunkId);
                sessionStorage.setItem('chunkMateState', JSON.stringify(appState));
                console.log(`[DELETE] record ${chunkId} removed.`);
                renderChunks(appState.data);
            }
        });

        chunkCardsContainer.addEventListener('change', (e) => {
            // UPDATE: when the Memorized checkbox is clicked
            if (e.target.classList.contains('update-check')) {
                const checkbox = e.target;
                const chunkId = Number(checkbox.id.replace('check-', ''));
                
                const chunkToUpdate = appState.data.find(c => c.id === chunkId);
                if (chunkToUpdate) {
                    chunkToUpdate.memorized = checkbox.checked;
                    sessionStorage.setItem('chunkMateState', JSON.stringify(appState));
                    console.log(`[UPDATE] record ${chunkId} updated.`);
                }
            }
        });
    }

    // ==========================================
    // Phase 3: admin page control (admin.html)
    // ==========================================
    const adminUserInfo = document.querySelector('#admin-user-info');
    if (adminUserInfo) {
        if (!appState.user.authenticated || appState.user.role !== 'admin') {
            alert("Access Denied. Admins only.");
            window.location.href = "../index.html";
            return;
        }

        adminUserInfo.innerHTML = `
            <p class="mb-1"><strong>Name:</strong> ${appState.user.name}</p>
            <p class="mb-1"><strong>Email:</strong> ${appState.user.email}</p>
            <p class="mb-0"><strong>Role:</strong> <span class="badge bg-danger">${appState.user.role}</span></p>
        `;

        document.querySelector('#app-state-output').textContent = JSON.stringify(appState, null, 2);

        document.querySelector('#btn-admin-signout').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = "../index.html";
        });
    }
});