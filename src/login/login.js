const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const emailHelper = email.nextElementSibling;
const passwordHelper = password.nextElementSibling;
const loginForm = document.getElementById('loginForm');

let users = []; // 유저 데이터 담을 공간

// 페이지 로드시 fetch로 user 데이터 읽기
fetch('../data/users.json')
  .then(response => response.json())
  .then(data => {
    users = data.users;
  })
  .catch(err => console.error('유저 데이터 로드 실패:', err));

email.addEventListener('input', validate);
password.addEventListener('input', validate);

// 유효성 검사
function validate() {
  let valid = true;
  const emailValue = email.value.trim();
  const pwValue = password.value.trim();

  // 이메일 검사
  if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    emailHelper.textContent = '*올바른 이메일 주소를 입력해주세요. (예: example@example.com)';
    valid = false;
  } else {
    emailHelper.textContent = '';
  }

  // 비밀번호 검사
  if (!pwValue) {
    passwordHelper.textContent = '*비밀번호를 입력해주세요.';
    valid = false;
  } else if (pwValue.length < 8 || pwValue.length > 20) {
    passwordHelper.textContent = '*비밀번호는 8자 이상, 20자 이하로 입력해야 합니다.';
    valid = false;
  } else {
    passwordHelper.textContent = '';
  }

  // 버튼 색상 및 상태 명세대로 적용
  if (valid) {
    loginBtn.disabled = false;
    loginBtn.style.backgroundColor = '#7F6AEE';
    loginBtn.style.cursor = 'pointer';
  } else {
    loginBtn.disabled = true;
    loginBtn.style.backgroundColor = '#ACA0EB';
    loginBtn.style.cursor = 'not-allowed';
  }
}

// 로그인 처리
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailValue = email.value.trim();
  const pwValue = password.value.trim();

  const user = users.find(user => user.email === emailValue && user.password === pwValue && !user.deleted);

  if (user) {
    // 로그인 성공 - 세션 저장
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    // alert('로그인 성공! 게시글 목록으로 이동합니다.');
    location.href = '../Post/Posts/Posts.html'; // 게시판 목록 페이지로 이동
  } else {
    // 로그인 실패
    alert('아이디 또는 비밀번호를 확인해주세요');
  }
});

// 회원가입 이동
signupBtn.addEventListener('click', () => {
  location.href = '../SignUp/SignUp.html';
});


/*
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: emailValue, password: pwValue })
})
.then(response => {
  if (!response.ok) throw new Error('로그인 실패');
  return response.json();
})
.then(data => {
  // ✅ 백엔드가 유저 정보 리턴해주면 저장
  sessionStorage.setItem('currentUser', JSON.stringify(data.user));
  alert('로그인 성공!');
  location.href = '../Post/Posts/Posts.html';
})
.catch(err => {
  alert('아이디 또는 비밀번호를 확인해주세요');
});
*/