document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const submitBtn = document.getElementById('submitBtn');
    const backBtn = document.getElementById('backBtn');
    const imageUpload = document.getElementById('imageUpload');
    const fileUploadText = document.querySelector('.file-upload-text');
  
    // 유효성 검사
    function validate() {
      if (title.value.trim() && content.value.trim()) {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '#7F6AEE';
        submitBtn.style.cursor = 'pointer';
      } else {
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#ACA0EB';
        submitBtn.style.cursor = 'not-allowed';
      }
    }
  
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
  
      // ✅ FormData 구성
      const formData = new FormData();
      formData.append('title', title.value.trim());
      formData.append('content', content.value.trim());
      console.log('제목:', title.value.trim());
      console.log('내용:', content.value.trim());   
      if (imageUpload.files[0]) {
        formData.append('image', imageUpload.files[0]);
      }
  
      try {
        // ✅ 실제 백엔드로 전송
        const response = await fetch('/api/posts', {
          method: 'POST',
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
  