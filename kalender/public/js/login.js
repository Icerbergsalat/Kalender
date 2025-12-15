const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Tjek om bruger allerede er logget ind
fetch('/api/auth/status')
    .then(res => res.json())
    .then(data => {
        if (data.loggetInd) {
            window.location.href = '/events.html';
        }
    });

// Skift mellem login og registrering
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    messageDiv.style.display = 'none';
    document.querySelector('.subtitle').textContent = 'Opret en ny bruger';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    messageDiv.style.display = 'none';
    document.querySelector('.subtitle').textContent = 'Log ind for at fortsætte';
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const brugernavn = document.getElementById('loginBrugernavn').value;
    const adgangskode = document.getElementById('loginAdgangskode').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brugernavn, adgangskode })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Login succesfuldt! Omdirigerer...', 'success');
            setTimeout(() => {
                window.location.href = '/events.html';
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Der opstod en fejl. Prøv igen.', 'error');
    }
});

// Registrering
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const brugernavn = document.getElementById('registerBrugernavn').value;
    const adgangskode = document.getElementById('registerAdgangskode').value;
    const adgangskodeGentag = document.getElementById('registerAdgangskodeGentag').value;

    if (adgangskode !== adgangskodeGentag) {
        showMessage('Adgangskoderne matcher ikke!', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/registrer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brugernavn, adgangskode })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Bruger oprettet! Omdirigerer...', 'success');
            setTimeout(() => {
                window.location.href = '/events.html';
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Der opstod en fejl. Prøv igen.', 'error');
    }
});

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
}