document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('passwordCheck');
    const passwordHelper = document.getElementById('passwordHelper');
    const passwordCheckHelper = document.getElementById('passwordCheckHelper');
    
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');
  
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    function validateForm() {
      const password = passwordInput.value.trim();
      const passwordCheck = passwordCheckInput.value.trim();
      let isValid = true;
  
      if (!password) {
        passwordHelper.textContent = '*비밀번호를 입력해주세요';
        isValid = false;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password)) {
        passwordHelper.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자/소문자/숫자/특수문자를 포함해야 합니다';
        isValid = false;
      } else {
        passwordHelper.textContent = '';
      }
  
      if (!passwordCheck) {
        passwordCheckHelper.textContent = '*비밀번호를 한 번 더 입력해주세요';
        isValid = false;
      } else if (password !== passwordCheck) {
        passwordCheckHelper.textContent = '*비밀번호 확인과 다릅니다';
        isValid = false;
      } else {
        passwordCheckHelper.textContent = '';
      }
  
      submitBtn.disabled = !isValid;
      submitBtn.style.backgroundColor = isValid ? '#7F6AEE' : '#ACA0EB';
    }
  
    [passwordInput, passwordCheckInput].forEach(input => input.addEventListener('input', validateForm));
  
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = passwordInput.value.trim();
  
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}/password`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password })
        });
  
        if (response.status === 204) {
            location.href = '../Post/Posts/Posts.html';
        } else {
          const err = await response.json();
          alert('비밀번호 수정 실패: ' + err.message);
        }
      } catch (err) {
        console.error('에러 발생', err);
        alert('비밀번호 수정 중 오류가 발생했습니다.');
      }
    });
  });
  