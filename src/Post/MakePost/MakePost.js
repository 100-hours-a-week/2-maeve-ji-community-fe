document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('title');
  const content = document.getElementById('content');
  const submitBtn = document.getElementById('submitBtn');
  const backBtn = document.getElementById('backBtn');
  const imageUpload = document.getElementById('imageUpload');
  const fileUploadText = document.querySelector('.file-upload-text');

   // JWT 토큰 가져오기 (로컬 스토리지에서)
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요합니다.');
    location.href = '../../login/login.html';
    return; // 더 이상 진행 X
  } else {
    console.log("JWT token: ", token);
  }

  // 유효성 검사
  function validate() {
    // 제목, 내용 다 있을 때 (이미지는 필요 아님))
    if (title.value.trim() && content.value.trim()) {
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = '#7F6AEE';
      submitBtn.style.cursor = 'pointer';
    } else {  // 제목, 내용이 없을 때
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = '#ACA0EB';
      submitBtn.style.cursor = 'not-allowed';
    }
  }

  // 제목 유효성 검사 (27자 이상이면 안됨)
  title.addEventListener('input', () => {
    if (title.value.length > 26) {
      title.value = title.value.slice(0, 26); // 26자까지만 잘라줌
      alert('제목은 최대 26자까지 입력할 수 있습니다.');
    }
    validate();
  });


  // 실시간 유효성 검사
  [title, content].forEach(input => {
    input.addEventListener('input', validate);
  });

  // 파일 업로드 시 파일명 표시
  imageUpload.addEventListener('change', (e) => {
    const fileName = e.target.files[0] ? e.target.files[0].name : '파일 선택';
    fileUploadText.textContent = fileName;
  });

  // 게시글 제출
  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!title.value.trim() || !content.value.trim()) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    // FormData로 만들기
    const formData = new FormData();
    formData.append('title', title.value.trim());
    formData.append('content', content.value.trim());

    console.log('제목:', title.value.trim());
    console.log('내용:', content.value.trim());   
    if (imageUpload.files[0]) {
      console.log('이미지 경로: ', imageUpload.files[0]);
      formData.append('imgUrl', imageUpload.files[0]);
    }

      // 로그 찍기
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    
    try {
      // 백엔드 연동 - Authorization 추가
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });
    
      if (!response.ok) throw new Error('게시글 등록 실패');
    
      const result = await response.json();
      // alert('게시글이 등록되었습니다!');
      location.href = '../Posts/Posts.html';
    
    } catch (err) {
      console.error(err);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
    
  });

  // 뒤로 가기
  backBtn.addEventListener('click', () => {
    history.back();
  });
});
