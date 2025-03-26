document.addEventListener('DOMContentLoaded', () => {
  const postDetail = document.querySelector('.post-detail');
  const commentList = document.querySelector('.comment-list');
  const commentInput = document.querySelector('.comment-section textarea');
  const commentSubmit = document.querySelector('.comment-submit');
  const deleteModal = document.getElementById('deleteModal');
  const confirmDelete = document.getElementById('confirmDelete');
  const cancelDelete = document.getElementById('cancelDelete');
  const commentDeleteModal = document.getElementById('commentDeleteModal');
  const commentConfirmDelete = document.getElementById('commentConfirmDelete');
  const commentCancelDelete = document.getElementById('commentCancelDelete');

  const profileIcon = document.querySelector('.profile-icon');
  const userImgUrl = localStorage.getItem('img_url');
  profileIcon.src = userImgUrl ? userImgUrl : '/default-profile.png';

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post_id');
  let postData;
  let isDeleted = false;
  let targetCommentId = null;

  console.log("불러온 postId:", postId);

  function fetchPostDetails() {
    if (isDeleted) return;
    fetch(`http://localhost:8080/posts/${postId}`)
      .then(res => {
        if (!res.ok) throw new Error('게시글 조회 실패');
        return res.json();
      })
      .then(data => {
        postData = data.data.data;
        const currentUserId = Number(localStorage.getItem('userId'));
        renderPost(postData, currentUserId);
        renderComments(postData.comments);
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  }

  fetchPostDetails();

  function renderPost(post, currentUserId) {
    const views = formatNumber(post.countView);
    const comments = formatNumber(post.countComment);
    const likes = formatNumber(post.countRecommend);
    const date = formatDate(post.created_at);
    const isAuthor = Number(currentUserId) === Number(post.author.user_id);

    const actionButtons = isAuthor ? `
      <button class="edit-btn">수정</button>
      <button class="delete-btn">삭제</button>
    ` : '';

    postDetail.innerHTML = `
      <div class="post-header">
        <h2>${post.title}</h2>
        <div class="post-actions">${actionButtons}</div>
      </div>
      <div class="author-info">
        <img src="${post.author.img_url}" alt="프로필">
        <span style="font-weight:bold">${post.author.nickname}</span>
        <div class="post-date">${date}</div>
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

    if (isAuthor) {
      postDetail.querySelector('.edit-btn').addEventListener('click', () => {
        location.href = `../EditPost/EditPost.html?postId=${post.post_id}`;
      });

      postDetail.querySelector('.delete-btn').addEventListener('click', () => {
        deleteModal.classList.remove('hidden');
      });
    }
  }

  function renderComments(comments) {
    commentList.innerHTML = '';
    const currentUserId = Number(localStorage.getItem('userId'));

    comments.forEach(cmt => {
      const isAuthor = Number(currentUserId) === Number(cmt.author.user_id);
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
          ${isAuthor ? `<button class="comment-delete-btn" data-comment-id="${cmt.comment_id}">삭제</button>` : ''}
        </div>
      `;
      commentList.appendChild(commentEl);
    });
  }

  // 댓글 등록
  commentSubmit.addEventListener('click', () => {
    const commentContent = commentInput.value.trim();
    if (!commentContent) return;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8080/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ comment: commentContent })
    })
      .then(res => {
        if (res.status === 201) return res.json();
        throw new Error('댓글 등록 실패');
      })
      .then(() => {
        commentInput.value = '';
        fetchPostDetails();
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  });

  // 게시글 삭제
  cancelDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
  });

  confirmDelete.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    fetch(`http://localhost:8080/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'post_delete_success') {
          alert('게시글이 삭제되었습니다.');
          isDeleted = true;
          window.location.href = '../Posts/Posts.html';
        } else {
          throw new Error('삭제 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('삭제 중 오류 발생');
      });
  });

  // 댓글 삭제 버튼 클릭 시 targetCommentId 세팅하고 모달 열기
  commentList.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-delete-btn')) {
      targetCommentId = e.target.dataset.commentId;
      console.log('✅ 선택된 commentId:', targetCommentId);
      if (!targetCommentId) {
        console.error('❌ commentId 없음');
        return;
      }
      commentDeleteModal.classList.remove('hidden');
    }
  });

  // 댓글 삭제 확정
  commentConfirmDelete.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token || !targetCommentId) {
      alert('삭제할 댓글이 존재하지 않습니다.');
      return;
    }

    fetch(`http://localhost:8080/posts/${postId}/comments/${targetCommentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status === 204) {
          alert('댓글이 삭제되었습니다.');
          commentDeleteModal.classList.add('hidden');
          fetchPostDetails();
        } else {
          throw new Error('댓글 삭제 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('댓글 삭제 실패');
      });
  });

  // 댓글 삭제 취소
  commentCancelDelete.addEventListener('click', () => {
    commentDeleteModal.classList.add('hidden');
  });

  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 10000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${Math.floor(num / 1000)}k`;
    return num;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }
});
