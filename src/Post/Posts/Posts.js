document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('postList');
  let postsData = [];
  let page = 0;
  const perPage = 3;
  let isLoading = false;

  // fetch
  fetch('../data/posts.json')
    .then(response => response.json())
    .then(data => {
      postsData = data.data.posts; // 구조 맞춰서 접근
      renderNextPosts();
    })
    .catch(err => console.error('데이터 불러오기 실패:', err));


  // 포스트 렌더링
  function renderNextPosts() {
    if (isLoading) return;
    isLoading = true;

    const start = page * perPage;
    const end = start + perPage;
    const nextPosts = postsData.slice(start, end);

    nextPosts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'post-card';

      const title = post.title.length > 26 ? post.title.slice(0, 26) + '...' : post.title;
      const views = formatNumber(post.countView);
      const likes = formatNumber(post.countRecommend); // JSON 구조대로 수정
      const comments = formatNumber(post.countComment);

      card.innerHTML = `
        <div class="post-top">
          <div>
            <div class="post-title">${title}</div>
            <div class="post-info">좋아요 ${likes}  댓글 ${comments}  조회수 ${views}</div>
          </div>
          <div class="post-date">${formatDate(post.created_at)}</div>
        </div>
        <div class="post-bottom">
          <img src="${post.author.img_url}" class="profile-img" alt="프로필">
          <div class="author">${post.author.nickname}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        alert(`상세 페이지로 이동 (post_id: ${post.post_id})`);
        // location.href = `./Post.html?post_id=${post.post_id}`;
      });

      postList.appendChild(card);
    });

    page++;
    isLoading = false;
  }

  // 숫자 형식 맞추기
  function formatNumber(number) {
    if (number >= 100000) return `${Math.floor(number / 1000)}k`;
    if (number >= 10000) return `${Math.floor(number / 1000)}k`;
    if (number >= 1000) return `${Math.floor(number / 1000)}k`;
    return number;
  }

  // 날짜 형식 맞추기 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
    
  document.getElementById('writeBtn').addEventListener('click', () => {
    // alert('게시글 작성 페이지로 이동');
    location.href = '../MakePost/MakePost.html';
  });

  // 무한 스크롤
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 50) {
      if (page * perPage < postsData.length) {
        renderNextPosts();
      }
    }
  });
});
