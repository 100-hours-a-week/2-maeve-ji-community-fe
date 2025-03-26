const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const emailHelper = email.nextElementSibling;
const passwordHelper = password.nextElementSibling;
const loginForm = document.getElementById('loginForm');

// 유효성 검사
email.addEventListener('input', validate);
password.addEventListener('input', validate);

function validate() {
  let valid = true;
  const emailValue = email.value.trim();
  const pwValue = password.value.trim();

  if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    emailHelper.textContent = '*올바른 이메일 주소를 입력해주세요. (예: example@example.com)';
    valid = false;
  } else {
    emailHelper.textContent = '';
  }

  if (!pwValue) {
    passwordHelper.textContent = '*비밀번호를 입력해주세요.';
    valid = false;
  } else if (pwValue.length < 8 || pwValue.length > 20) {
    passwordHelper.textContent = '*비밀번호는 8자 이상, 20자 이하로 입력해야 합니다.';
    valid = false;
  } else {
    passwordHelper.textContent = '';
  }

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

// 로그인 API 연동
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailValue = email.value.trim();
  const pwValue = password.value.trim();

  try {
    const response = await fetch('http://localhost:8080/auth/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue, password: pwValue }),
      credentials: 'include'
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log('** 로그인 성공:', data);

      // JWT 토큰, userId 저장 
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.userId);

      location.href = '../Post/Posts/Posts.html'; // 게시판 목록으로 이동
    } else if (response.status === 401) {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    } else if (response.status === 404) {
      alert('가입된 사용자가 없습니다.');
    } else {
      throw new Error('서버 오류');
    }
  } catch (err) {
    console.error('상태코드: ', response.status);
    console.error('** 로그인 실패:', err);
    alert('로그인에 실패하였습니다. 잠시 후 다시 시도해주세요.');
  }
});


function fetchUserProfile(userId, token) {
  fetch(`http://localhost:8080/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('유저 정보 조회 실패');
      return res.json();
    })
    .then(userResult => {
      console.log('유저 정보:', userResult);
      const img_url = userResult.data.img_url;
      const nickname = userResult.data.nickname;
      
      // ✅ 프로필 이미지와 닉네임도 저장
      localStorage.setItem('img_url', img_url);
      localStorage.setItem('nickname', nickname);

      // ✅ 메인 페이지 이동 or 성공 알림
      alert('로그인 성공!');
      location.href = '../Posts/Posts.html';
    })
    .catch(err => {
      console.error('유저 정보 불러오기 실패:', err);
      alert('유저 정보 불러오기 실패');
    });
}


// 회원가입 이동
signupBtn.addEventListener('click', () => {
  location.href = '../SignUp/SignUp.html';
});
