const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerButton = document.getElementById('register-button');

function updateButtonState() {
    const isFilled = emailInput.value.trim() && passwordInput.value.trim();
    registerButton.classList.toggle('active', isFilled);
}

emailInput.addEventListener('input', updateButtonState);
passwordInput.addEventListener('input', updateButtonState);