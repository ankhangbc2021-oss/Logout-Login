/* ============================================================
   AuthFlow — script.js
   Handles: floating labels, form switch, validation,
            password toggle, strength meter, submit simulation
============================================================ */

// ─── DOM refs ────────────────────────────────────────────────
const loginPanel    = document.getElementById('login-panel');
const registerPanel = document.getElementById('register-panel');
const showRegisterBtn = document.getElementById('show-register-btn');
const showLoginBtn    = document.getElementById('show-login-btn');

// ─── Switch between Login ↔ Register ─────────────────────────
function switchTo(panel) {
  [loginPanel, registerPanel].forEach(p => p.classList.add('hidden'));
  panel.classList.remove('hidden');
  // re-trigger animation
  panel.style.animation = 'none';
  panel.offsetHeight; // reflow
  panel.style.animation = '';
}

showRegisterBtn.addEventListener('click', () => switchTo(registerPanel));
showLoginBtn.addEventListener('click',    () => switchTo(loginPanel));

// ─── Toggle password visibility ──────────────────────────────
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const eyeOpen  = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');

    if (input.type === 'password') {
      input.type = 'text';
      eyeOpen.style.display  = 'none';
      eyeClosed.style.display = '';
    } else {
      input.type = 'password';
      eyeOpen.style.display  = '';
      eyeClosed.style.display = 'none';
    }
  });
});

// ─── Password strength meter ──────────────────────────────────
const regPasswordInput = document.getElementById('reg-password');
const strengthFill     = document.getElementById('strength-fill');

const strengthLevels = [
  { color: '#FF5A5F', pct: '20%'  },   // very weak
  { color: '#FF5A5F', pct: '40%'  },   // weak
  { color: '#FFB940', pct: '60%'  },   // fair
  { color: '#22D3A5', pct: '80%'  },   // strong
  { color: '#22D3A5', pct: '100%' },   // very strong
];

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 14) score++;
  return Math.min(score, 5);
}

regPasswordInput.addEventListener('input', () => {
  const pw    = regPasswordInput.value;
  const score = calcStrength(pw);
  const bar   = strengthLevels[Math.max(score - 1, 0)];

  if (pw === '') {
    strengthFill.style.width = '0%';
  } else {
    strengthFill.style.width           = bar.pct;
    strengthFill.style.backgroundColor = bar.color;
  }

  // strength bar lives in .input-group (outside .input-wrap)
  const barWrapper = regPasswordInput.closest('.input-group').querySelector('.strength-bar');
  if (barWrapper) barWrapper.classList.toggle('visible', pw.length > 0);
});

// ─── Validation helpers ───────────────────────────────────────
function setError(inputEl, message) {
  // error-text lives in .input-group (parent of .input-wrap)
  const group = inputEl.closest('.input-group');
  const small = group && group.querySelector('.error-text');
  inputEl.classList.add('is-invalid');
  inputEl.classList.remove('is-valid');
  if (small) { small.textContent = message; }
}

function setValid(inputEl) {
  const group = inputEl.closest('.input-group');
  const small = group && group.querySelector('.error-text');
  inputEl.classList.remove('is-invalid');
  inputEl.classList.add('is-valid');
  if (small) small.textContent = '';
}

function clearState(inputEl) {
  const group = inputEl.closest('.input-group');
  const small = group && group.querySelector('.error-text');
  inputEl.classList.remove('is-invalid', 'is-valid');
  if (small) small.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Real-time validation hints (on blur) ────────────────────
function attachBlurValidation(inputEl, validator) {
  inputEl.addEventListener('blur', () => {
    if (inputEl.value.trim() === '') { clearState(inputEl); return; }
    validator(inputEl);
  });
  inputEl.addEventListener('input', () => {
    if (inputEl.classList.contains('is-invalid')) validator(inputEl);
  });
}

// Login fields
attachBlurValidation(document.getElementById('login-email'), el => {
  if (!isValidEmail(el.value)) setError(el, 'Email không hợp lệ.');
  else setValid(el);
});
attachBlurValidation(document.getElementById('login-password'), el => {
  if (el.value.length < 6) setError(el, 'Mật khẩu phải có ít nhất 6 ký tự.');
  else setValid(el);
});

// Register fields
attachBlurValidation(document.getElementById('reg-name'), el => {
  if (el.value.trim().length < 2) setError(el, 'Vui lòng nhập họ tên hợp lệ.');
  else setValid(el);
});
attachBlurValidation(document.getElementById('reg-email'), el => {
  if (!isValidEmail(el.value)) setError(el, 'Email không hợp lệ.');
  else setValid(el);
});
attachBlurValidation(document.getElementById('reg-password'), el => {
  if (el.value.length < 8) setError(el, 'Mật khẩu phải có ít nhất 8 ký tự.');
  else setValid(el);
});
attachBlurValidation(document.getElementById('reg-confirm'), el => {
  if (el.value !== document.getElementById('reg-password').value) setError(el, 'Mật khẩu xác nhận không khớp.');
  else setValid(el);
});

// ─── Simulate submit (loading → success/error) ────────────────
function simulateSubmit(btn, successMsg) {
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;

    // Flash success color
    const orig = btn.style.background;
    btn.style.background = 'linear-gradient(135deg,#22D3A5,#0EA5E9)';
    btn.querySelector('.btn-text').textContent = successMsg;

    setTimeout(() => {
      btn.style.background = '';
      btn.querySelector('.btn-text').textContent = btn.id === 'login-btn' ? 'Đăng nhập' : 'Tạo tài khoản';
    }, 2000);
  }, 1800);
}

// ─── Login form submit ────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const emailEl = document.getElementById('login-email');
  const passEl  = document.getElementById('login-password');
  let valid = true;

  if (!isValidEmail(emailEl.value)) { setError(emailEl, 'Email không hợp lệ.'); valid = false; } else setValid(emailEl);
  if (passEl.value.length < 6)      { setError(passEl,  'Mật khẩu phải có ít nhất 6 ký tự.'); valid = false; } else setValid(passEl);

  if (valid) simulateSubmit(document.getElementById('login-btn'), '✓ Đăng nhập thành công!');
});

// ─── Register form submit ─────────────────────────────────────
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const nameEl    = document.getElementById('reg-name');
  const emailEl   = document.getElementById('reg-email');
  const passEl    = document.getElementById('reg-password');
  const confirmEl = document.getElementById('reg-confirm');
  const termsEl   = document.getElementById('agree-terms');
  let valid = true;

  if (nameEl.value.trim().length < 2)              { setError(nameEl,    'Vui lòng nhập họ tên hợp lệ.'); valid = false; } else setValid(nameEl);
  if (!isValidEmail(emailEl.value))                 { setError(emailEl,   'Email không hợp lệ.'); valid = false; } else setValid(emailEl);
  if (passEl.value.length < 8)                      { setError(passEl,    'Mật khẩu phải có ít nhất 8 ký tự.'); valid = false; } else setValid(passEl);
  if (confirmEl.value !== passEl.value)             { setError(confirmEl, 'Mật khẩu xác nhận không khớp.'); valid = false; } else setValid(confirmEl);
  if (!termsEl.checked) {
    valid = false;
    termsEl.closest('.checkbox-wrap').style.color = 'var(--danger)';
    setTimeout(() => { termsEl.closest('.checkbox-wrap').style.color = ''; }, 2000);
  }

  if (valid) simulateSubmit(document.getElementById('register-btn'), '✓ Đăng ký thành công!');
});