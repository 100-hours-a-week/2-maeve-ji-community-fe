document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    const emailInput = document.getElementById('email');
    const nicknameInput = document.getElementById('nickname');
    const nicknameHelper = document.getElementById('nicknameHelper');
    const profileInput = document.getElementById('profileInput');
    const previewImage = document.getElementById('previewImage');
    const toast = document.getElementById('toast');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const withdrawModal = document.getElementById('withdrawModal');
    const cancelWithdraw = document.getElementById('cancelWithdraw');
    const confirmWithdraw = document.getElementById('confirmWithdraw');
  
    let originalNickname = '';
    let originalImgUrl = '';
    let profileImageFile = null;
  
    // 유저 정보 조회
    fetch(`http://localhost:8080/users/${userId}`, {
      headers: { 
        'Authorization': 'Bearer ' + token
    },
    })
      .then(res => res.json())
      .then(data => {
        const user = data.data;
        emailInput.value = user.email;
        originalNickname = user.nickname;
        nicknameInput.placeholder = user.nickname;
        previewImage.src = user.imgUrl || '/images/default-profile.png';
        originalImgUrl = user.imgUrl;
      })
      .catch(err => console.error('유저 정보 조회 실패', err));
  
    // 이미지 미리보기
    profileInput.addEventListener('change', (e) => {
      profileImageFile = e.target.files[0];
      if (profileImageFile) {
        const reader = new FileReader();
        reader.onload = e => previewImage.src = e.target.result;
        reader.readAsDataURL(profileImageFile);
      }
    });
  
    // 수정하기
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const nickname = nicknameInput.value.trim() || originalNickname;
  
      if (nickname.length > 10) {
        nicknameHelper.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
        return;
      } else if (!nickname) {
        nicknameHelper.textContent = '*닉네임을 입력해주세요.';
        return;
      }
  
      nicknameHelper.textContent = '';
      console.log('수정된 닉네임: ', nickname);
      console.log('수정된 url: ', profileImageFile);
      try {
        const formData = new FormData();
        const userDto = {
          nickname: nickname,
          img_url: originalImgUrl
        };
        formData.append('userDto', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
  
        if (profileImageFile) {
          formData.append('profileImage', profileImageFile);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
          }          
        
        const res = await fetch(`http://localhost:8080/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData
        });
  
        if (res.status === 204) {
          location.href = '../Post/Posts/Posts.html';
            if (profileImageFile) {
              const objectUrl = URL.createObjectURL(profileImageFile);
              localStorage.setItem('img_url', objectUrl);
            }
        } else {
          const errData = await res.json();
          console.error('수정 실패', errData);
          alert('회원정보 수정에 실패했습니다.');
        }
      } catch (err) {
        console.error(err);
        alert('회원정보 수정 중 오류가 발생했습니다.');
      }
    });
  
    // 회원 탈퇴
    withdrawBtn.addEventListener('click', () => {
      withdrawModal.classList.remove('hidden');
    });
  
    cancelWithdraw.addEventListener('click', () => {
      withdrawModal.classList.add('hidden');
    });
  
    confirmWithdraw.addEventListener('click', () => {
      fetch(`http://localhost:8080/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'user_delete_success') {
            alert('회원 탈퇴가 완료되었습니다.');
            localStorage.clear();
            location.href = '../login/login.html';
          } else {
            throw new Error(data.message);
          }
        })
        .catch(err => {
          console.error(err);
          alert('회원 탈퇴 중 오류가 발생했습니다.');
        });
    });
  });
  