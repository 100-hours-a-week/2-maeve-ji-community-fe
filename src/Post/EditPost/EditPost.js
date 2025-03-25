document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const imageUpload = document.getElementById('imageUpload');
    const updateBtn = document.getElementById('updateBtn');
    const backBtn = document.getElementById('backBtn');
  
    // 추후 URL 파라미터에서 postId 받아서 API 요청으로 변경
    fetch('../../data/post.json')
      .then(res => res.json())
      .then(data => {
        const post = data.data.data; // JSON 구조에 맞게 접근
        renderPost(post);
      })
      .catch(err => console.error('게시글 로드 실패', err));
  
    function renderPost(post) {
      title.value = post.title;
      content.value = post.contents;
      // 기존 이미지 파일명을 표시할 수도 있음 (화면에 추가 구현 필요)
    }
  
    // 유효성 검사
    function validate() {
      if (title.value.trim() && content.value.trim()) {
        updateBtn.disabled = false;
        updateBtn.style.backgroundColor = '#7F6AEE';
        updateBtn.style.cursor = 'pointer';
      } else {
        updateBtn.disabled = true;
        updateBtn.style.backgroundColor = '#ACA0EB';
        updateBtn.style.cursor = 'not-allowed';
      }
    }
  
    [title, content].forEach(input => input.addEventListener('input', validate));
  
    // 수정 요청
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('title', title.value.trim());
      formData.append('content', content.value.trim());
      if (imageUpload.files[0]) {
        formData.append('image', imageUpload.files[0]);
      }
  
      try {
        // 나중에 실제 API로 변경
        const response = await fetch(`/api/posts/{postId}`, {
          method: 'PUT',
          body: formData
        });
  
        if (!response.ok) throw new Error('게시글 수정 실패');
  
        alert('게시글이 수정되었습니다!');
        location.href = '../Post/Post.html';
      } catch (err) {
        console.error(err);
        alert('게시글 수정 중 오류가 발생했습니다.');
      }
    });
  
    backBtn.addEventListener('click', () => {
      history.back();
    });
  });