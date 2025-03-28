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
  if (profileIcon) {
    profileIcon.src = userImgUrl ? userImgUrl : '/default-profile.png';
  }

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post_id');
  let postData;
  let isDeleted = false;
  let targetCommentId = null;
  let isEditMode = false;
  let editingCommentId = null;

  function fetchPostDetails() {
    if (isDeleted) return;
    const visitedKey = `visited_post_${postId}`;
    const hasVisited = sessionStorage.getItem(visitedKey);
    const url = hasVisited
      ? `http://localhost:8080/posts/${postId}?count=false`
      : `http://localhost:8080/posts/${postId}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('게시글 조회 실패');
        return res.json();
      })
      .then(data => {
        postData = data.data.data;
        const currentUserId = Number(localStorage.getItem('userId'));
        renderPost(postData, currentUserId);
        renderComments(postData.comments);
        if (!hasVisited) {
          sessionStorage.setItem(visitedKey, 'true');
        }
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

    const liked = post.isLikedByCurrentUser;
    const likeBtnColor = liked ? '#ACA0EB' : '#D9D9D9';
    console.log('이미지 경로: ', post.img_url);

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
    ${post.img_url ? `
      <div class="post-image">
        <img src="${post.img_url}" alt="게시글 이미지">
      </div>
    ` : ''}
      <p class="post-content">${post.contents}</p>
      <div class="post-status">
        <div class="status-box">
          <button id="likeBtn" style="background-color: ${likeBtnColor}; padding: 5px 10px; border-radius: 5px; border: none; cursor: pointer;">좋아요</button>
          <br> ${likes}
        </div>
        <div class="status-box">${views} <br> 조회수</div>
        <div class="status-box">${comments} <br> 댓글</div>
      </div>
    `;

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const isLiked = likeBtn.style.backgroundColor === 'rgb(172, 160, 235)';

      fetch(`http://localhost:8080/posts/${postId}/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: isLiked ? null : JSON.stringify({ user_id: Number(localStorage.getItem('userId')) })
      })
        .then(res => {
          if (!res.ok && res.status !== 204) throw new Error('좋아요 요청 실패');
          fetchPostDetails();
        })
        .catch(err => {
          console.error(err);
          alert('좋아요 처리 실패');
        });
    });

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
          <img class="profile" src="${cmt.author.img_url || '/images/default-profile.png'}" alt="프로필 이미지">
          <span>${cmt.author.nickname}</span>
          <span class="date">${formatDate(cmt.created_at)}</span>
        </div>
        <p class="comment-text">${cmt.comment}</p>
        <div class="comment-actions">
          ${isAuthor ? `
            <button class="comment-edit-btn" data-id="${cmt.id}" data-text="${cmt.comment}">수정</button>
            <button class="comment-delete-btn" data-id="${cmt.id}">삭제</button>
          ` : ''}
        </div>
      `;
      commentList.appendChild(commentEl);
    });
  }

  commentList.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-edit-btn')) {
      editingCommentId = e.target.dataset.id;
      const originalText = e.target.dataset.text;
      commentInput.value = originalText;
      commentSubmit.textContent = '댓글 수정';
      isEditMode = true;
    }

    if (e.target.classList.contains('comment-delete-btn')) {
      targetCommentId = e.target.dataset.id;
      commentDeleteModal.classList.remove('hidden');
    }
  });

  commentSubmit.addEventListener('click', () => {
    const content = commentInput.value.trim();
    const token = localStorage.getItem('token');
    if (!content || !token) return;

    const url = isEditMode
      ? `http://localhost:8080/posts/${postId}/comments/${editingCommentId}`
      : `http://localhost:8080/posts/${postId}/comments`;

    const method = isEditMode ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ comment: content })
    })
      .then(res => {
        if (!res.ok) throw new Error('댓글 등록/수정 실패');
        commentInput.value = '';
        commentSubmit.textContent = '댓글 등록';
        isEditMode = false;
        editingCommentId = null;
        fetchPostDetails();
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  });

  cancelDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
  });

  confirmDelete.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) return;

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
        window.location.href = '../Posts/Posts.html';
      });
  });

  commentConfirmDelete.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token || !targetCommentId) return;

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
        commentDeleteModal.classList.add('hidden');
        fetchPostDetails();
      });
  });

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