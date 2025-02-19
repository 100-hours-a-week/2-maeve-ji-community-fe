const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
}

function validateForm() {
    const emailValid = validateEmail(emailInput.value);
    const passwordValid = validatePassword(passwordInput.value);

    emailError.style.display = emailValid ? 'none' : 'block';
    passwordError.style.display = passwordValid ? 'none' : 'block';

    loginBtn.disabled = !(emailValid && passwordValid);
}

emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

function goToSignup() {
    window.location.href = 'signup.html';
}

loginBtn.addEventListener('click', function() {
    alert('로그인 성공!');
    window.location.href = 'home.html';
});
