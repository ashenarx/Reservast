const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerButton = document.getElementById('register-button');

function updateButtonState() {
    const isFilled = emailInput.value.trim() && passwordInput.value.trim();
    registerButton.classList.toggle('active', isFilled);
}

function redirectToHome() {
    if (emailInput.value.trim() && passwordInput.value.trim()) {
        window.location.href = '../home/home.html';
    }
}

emailInput.addEventListener('input', updateButtonState);
passwordInput.addEventListener('input', updateButtonState);
registerButton.addEventListener('click', redirectToHome);