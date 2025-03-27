document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editPostForm');
  const updateBtn = document.getElementById('updateBtn');
  const imageUpload = document.getElementById('imageUpload');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const currentImageText = document.getElementById('currentImage'); // span 요소 필요

  const token = localStorage.getItem('token');
  const postId = new URLSearchParams(window.location.search).get('postId');

  fetch(`http://localhost:8080/posts/${postId}`)
  .then(res => res.json())
  .then(data => {
    const post = data.data.data;
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.contents;

    if (post.img_url) {
      const fileName = post.img_url.split('/').pop();
      document.getElementById('fileName').textContent = `현재 이미지: ${fileName}`;
    }
  });

// 파일 선택 시 실제 파일 이름으로 덮어쓰기
document.getElementById('imageUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('fileName').textContent = `선택한 이미지: ${file.name}`;
  }
});

  form.addEventListener('submit', e => e.preventDefault());

  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageUpload.files.length > 0) {
      formData.append('image', imageUpload.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('서버 응답:', errText);
        throw new Error('게시글 수정 실패');
      }

      alert('게시글이 수정되었습니다!');
      window.location.href = `../Post/Post.html?post_id=${postId}`;
    } catch (err) {
      console.error(err);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  });
});
