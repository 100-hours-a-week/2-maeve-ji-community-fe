export function initHeader() {
  const profileImage = document.getElementById('profileImage');
  const dropdown = document.getElementById('profileDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  console.log('header token:', token);
  console.log('header userId:', userId);

  if (token && userId) {
    fetch(`http://localhost:8080/users/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        const userImg = data.data.imgUrl;
        if (userImg) {
          profileImage.src = userImg;
        }
      })
      .catch(err => console.error('유저 정보 불러오기 실패', err));
  }

  profileImage.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    dropdown.classList.add('hidden');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('img_url');
    // alert('로그아웃 되었습니다.');
    location.href = 'http://127.0.0.1:5500/src/login/login.html';
  });
}

// ✅ 자동 실행 추가
initHeader();
