// const email = document.getElementById('email');
// const password = document.getElementById('password');
// const passwordCheck = document.getElementById('passwordCheck');
// const nickname = document.getElementById('nickname');
// const signupBtn = document.getElementById('signupBtn');
// const loginMoveBtn = document.getElementById('loginMoveBtn');
// const profileUpload = document.querySelector('.profile-upload');
// const profileImageInput = document.getElementById('profileImage');
// const emailHelper = email.nextElementSibling;
// const passwordHelper = password.nextElementSibling;
// const passwordCheckHelper = passwordCheck.nextElementSibling;
// const nicknameHelper = nickname.nextElementSibling;

// let profileImageFile = null;

// // 실시간 유효성 검사
// [email, password, passwordCheck, nickname].forEach(input => {
//   input.addEventListener('input', validateForm);
// });

// // 프로필 사진 업로드
// profileUpload.addEventListener('click', () => profileImageInput.click());
// profileImageInput.addEventListener('change', (e) => {
//   profileImageFile = e.target.files[0];
//   if (profileImageFile) {
//     const img = document.createElement('img');
//     img.src = URL.createObjectURL(profileImageFile);
//     profileUpload.innerHTML = '';
//     profileUpload.appendChild(img);
//   }
// });

// // 유효성 검사
// function validateForm() {
//   let valid = true;

//   // 이메일
//   if (!email.value.trim()) {
//     emailHelper.textContent = '*이메일을 입력해주세요';
//     valid = false;
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
//     emailHelper.textContent = '*올바른 이메일 형식을 입력하세요 (예: example@example.com)';
//     valid = false;
//   } else {
//     emailHelper.textContent = '';
//   }

//   // 비밀번호
//   if (!password.value.trim()) {
//     passwordHelper.textContent = '*비밀번호를 입력해주세요';
//     valid = false;
//   } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password.value)) {
//     passwordHelper.textContent = '*비밀번호는 8~20자, 대소문자/숫자/특수문자 포함';
//     valid = false;
//   } else {
//     passwordHelper.textContent = '';
//   }

//   // 비밀번호 확인
//   if (!passwordCheck.value.trim()) {
//     passwordCheckHelper.textContent = '*비밀번호를 다시 입력해주세요';
//     valid = false;
//   } else if (password.value !== passwordCheck.value) {
//     passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
//     valid = false;
//   } else {
//     passwordCheckHelper.textContent = '';
//   }

//   // 닉네임
//   if (!nickname.value.trim()) {
//     nicknameHelper.textContent = '*닉네임을 입력해주세요';
//     valid = false;
//   } else if (nickname.value.length > 10) {
//     nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
//     valid = false;
//   } else {
//     nicknameHelper.textContent = '';
//   }

//   signupBtn.disabled = !valid;
//   signupBtn.style.backgroundColor = valid ? '#7F6AEE' : '#ACA0EB';
// }

// // 회원가입 처리 
// document.getElementById('signupForm').addEventListener('submit', async (e) => {

//   // 프로필 이미지
//   if (!profileImageFile) {
//     alert("프로필 이미지는 필수입니다");
//   }

//   e.preventDefault();

//   // 백엔드에 넘길 FormData 만들기
//   const formData = new FormData();
//   const userDto = {
//     email: email.value.trim(),
//     password: password.value.trim(),
//     nickname: nickname.value.trim()
//   };
//   formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: "application/json" }));

//   if (profileImageFile) {
//     formData.append('profileImage', profileImageFile);
//   }

//   // 로그 찍기
//   for (let [key, value] of formData.entries()) {
//     console.log(`${key}:`, value);
//   }

//   try {
//     // 백엔드 연동
//     const response = await fetch('http://localhost:8080/users', {
//       method: 'POST',
//       body: formData
//     });

//     if (!response.ok) throw new Error('회원가입 실패');
    
//     // alert('회원가입 완료! 로그인 페이지로 이동합니다.');
//     location.href = '../login/login.html';
//   } catch (err) {
//     alert('회원가입에 실패하였습니다. ' + err.message);
//   }
// });

// // 로그인 페이지 이동
// loginMoveBtn.addEventListener('click', () => {
//   location.href = '../login/login.html';
// });
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordCheck = document.getElementById('passwordCheck');
const nickname = document.getElementById('nickname');
const signupBtn = document.getElementById('signupBtn');
const loginMoveBtn = document.getElementById('loginMoveBtn');
const profileUpload = document.querySelector('.profile-upload');
const profileImageInput = document.getElementById('profileImage');
const emailHelper = email.nextElementSibling;
const passwordHelper = password.nextElementSibling;
const passwordCheckHelper = passwordCheck.nextElementSibling;
const nicknameHelper = nickname.nextElementSibling;

let profileImageFile = null;

// 실시간 유효성 검사
[email, password, passwordCheck, nickname].forEach(input => {
  input.addEventListener('input', validateForm);
});
profileImageInput.addEventListener('change', validateForm);

// 프로필 사진 업로드
profileUpload.addEventListener('click', () => profileImageInput.click());
profileImageInput.addEventListener('change', (e) => {
  profileImageFile = e.target.files[0];
  if (profileImageFile) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(profileImageFile);
    profileUpload.innerHTML = '';
    profileUpload.appendChild(img);
  }
  validateForm();
});

// 유효성 검사
function validateForm() {
  let valid = true;

  // 이메일
  if (!email.value.trim()) {
    emailHelper.textContent = '*이메일을 입력해주세요';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailHelper.textContent = '*올바른 이메일 형식을 입력하세요';
    valid = false;
  } else {
    emailHelper.textContent = '';
  }

  // 비밀번호
  if (!password.value.trim()) {
    passwordHelper.textContent = '*비밀번호를 입력해주세요';
    valid = false;
  } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password.value)) {
    passwordHelper.textContent = '*비밀번호는 8~20자, 대소문자/숫자/특수문자 포함';
    valid = false;
  } else {
    passwordHelper.textContent = '';
  }

  // 비밀번호 확인
  if (!passwordCheck.value.trim()) {
    passwordCheckHelper.textContent = '*비밀번호를 다시 입력해주세요';
    valid = false;
  } else if (password.value !== passwordCheck.value) {
    passwordCheckHelper.textContent = '*비밀번호가 다릅니다';
    valid = false;
  } else {
    passwordCheckHelper.textContent = '';
  }

  // 닉네임
  if (!nickname.value.trim()) {
    nicknameHelper.textContent = '*닉네임을 입력해주세요';
    valid = false;
  } else if (nickname.value.length > 10) {
    nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
    valid = false;
  } else {
    nicknameHelper.textContent = '';
  }

  // 프로필 이미지 체크
  if (!profileImageFile) {
    valid = false;
  }

  signupBtn.disabled = !valid;
  signupBtn.style.backgroundColor = valid ? '#7F6AEE' : '#ACA0EB';
}

// 회원가입 처리
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!profileImageFile) {
    alert("프로필 이미지는 필수입니다.");
    return;
  }

  const formData = new FormData();
  const userDto = {
    email: email.value.trim(),
    password: password.value.trim(),
    nickname: nickname.value.trim()
  };
  formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: "application/json" }));
  formData.append('profileImage', profileImageFile);

  try {
    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('회원가입 실패');
    location.href = '../login/login.html';
  } catch (err) {
    alert('회원가입에 실패하였습니다. ' + err.message);
  }
});

// 로그인 이동
loginMoveBtn.addEventListener('click', () => {
  location.href = '../login/login.html';
});
