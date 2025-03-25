document.addEventListener('DOMContentLoaded', () => {
    const postDetail = document.querySelector('.post-detail');
    const commentList = document.querySelector('.comment-list');
    const commentInput = document.querySelector('.comment-section textarea');
    const commentSubmit = document.querySelector('.comment-submit');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
  
    let postData;
  
    fetch('../../data/post.json')
      .then(res => res.json())
      .then(data => {
        postData = data.data.data; // JSON 구조 맞춰서 꺼냄
        renderPost(postData);
        renderComments(postData.comments);
      })
      .catch(err => console.error('게시글 로드 실패', err));
  
    function renderPost(post) {
      const views = formatNumber(post.countView);
      const comments = formatNumber(post.countComment);
      const likes = formatNumber(post.countRecommend);
      const date = formatDate(post.created_at);
  
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <div class="author-info">
          <img src="${post.author.img_url}" alt="프로필">
          <span>${post.author.nickname}</span>
          <span>${date}</span>
        </div>
        <div class="post-actions">
          <button class="edit-btn">수정</button>
          <button class="delete-btn">삭제</button>
        </div>
        <div class="post-image">
          <img src="${post.img_url || 'https://via.placeholder.com/300'}" alt="게시글 이미지">
        </div>
        <p class="post-content">${post.contents}</p>
        <div class="post-status">
          <div class="status-box">${likes} <br> 좋아요</div>
          <div class="status-box">${views} <br> 조회수</div>
          <div class="status-box">${comments} <br> 댓글</div>
        </div>
      `;
  
      // 수정 버튼 이벤트
      postDetail.querySelector('.edit-btn').addEventListener('click', () => {
        location.href = `../EditPost/EditPost.html?postId=${post.post_id}`;
      });
  
      // 삭제 버튼 이벤트
      postDetail.querySelector('.delete-btn').addEventListener('click', () => {
        document.getElementById('deleteModal').classList.remove('hidden');
      });
    }
  
    function renderComments(comments) {
      commentList.innerHTML = '';
      comments.forEach(cmt => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
          <div class="comment-author">
            <div class="profile"></div>
            <span>${cmt.author.nickname}</span>
            <span class="date">${formatDate(cmt.created_at)}</span>
          </div>
          <p class="comment-text">${cmt.comment}</p>
          <div class="comment-actions">
            <button class="edit-btn">수정</button>
            <button class="delete-btn">삭제</button>
          </div>
        `;
        commentList.appendChild(commentEl);
      });
    }
  
    // 숫자 포맷
    function formatNumber(num) {
      if (num >= 100000) return `${Math.floor(num / 1000)}k`;
      if (num >= 10000) return `${Math.floor(num / 1000)}k`;
      if (num >= 1000) return `${Math.floor(num / 1000)}k`;
      return num;
    }
  
    // 날짜 포맷
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
    }
  
    // 댓글 등록
    commentSubmit.addEventListener('click', () => {
      if (!commentInput.value.trim()) return;
      const newComment = document.createElement('div');
      newComment.className = 'comment';
      newComment.innerHTML = `
        <div class="comment-author">
          <div class="profile"></div>
          <span>작성자</span>
          <span class="date">${formatDate(new Date())}</span>
        </div>
        <p class="comment-text">${commentInput.value.trim()}</p>
        <div class="comment-actions">
          <button class="edit-btn">수정</button>
          <button class="delete-btn">삭제</button>
        </div>
      `;
      commentList.appendChild(newComment);
      commentInput.value = '';
    });
  
    // 삭제 모달 확인
    confirmDelete.addEventListener('click', () => {
      alert('삭제되었습니다.');
      // 나중엔 fetch(`/api/posts/${postData.post_id}`, { method: 'DELETE' })로 변경
      location.href = '../Posts/Posts.html';
    });
  
    // 삭제 모달 취소
    cancelDelete.addEventListener('click', () => {
      document.getElementById('deleteModal').classList.add('hidden');
    });
  });
  