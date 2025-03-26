document.addEventListener('DOMContentLoaded', () => {
  const postList = document.getElementById('postList');
  let postsData = [];
  let page = 0;
  const perPage = 10;
  let isLoading = false;

  // JWT 토큰 가져오기 (localStorage)
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요합니다.');
    location.href = '../../login/login.html';
    return; // 더 이상 진행 X
  } else {
    console.log("JWT token: ", token);
  }

  // 게시글 목록 조회
  function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    fetch('http://localhost:8080/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // ✅ 반드시 토큰 추가
      }
    })
      .then(response => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              throw new Error('잘못된 요청입니다.');
            case 401:
              throw new Error('인증되지 않은 사용자입니다.');
            case 403:
              throw new Error('접근 권한이 없습니다.');
            default:
              throw new Error('서버 응답 실패');
          }
        }
        return response.json();
      })
      .then(result => {
        console.log('서버에서 받아온 데이터:', result);
        if (result && result.data && result.data.posts) {
          postsData = result.data.posts;
          renderNextPosts();
        } else {
          console.error('유효한 게시글 데이터가 없습니다.');
        }
      })
      .catch(err => {
        console.error('데이터 가져오기 실패:', err);
        alert(err.message);
        if (err.message.includes('인증')) {
          localStorage.removeItem('token'); // 토큰 제거 후
          location.href = '../../login/login.html'; // 로그인 페이지로
        }
      })
      .finally(() => {
        isLoading = false;
      });
  }

  // 포스트 렌더링 함수
  function renderNextPosts() {
    const start = page * perPage;
    const end = start + perPage;
    const nextPosts = postsData.slice(start, end);

    nextPosts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'post-card';

      const title = post.title.length > 26 ? post.title.slice(0, 26) + '...' : post.title;
      const views = formatNumber(post.countView);
      const likes = formatNumber(post.countRecommend);
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
  }

  // 숫자 포맷팅
  function formatNumber(number) {
    if (number >= 100000) return `${Math.floor(number / 1000)}k`;
    if (number >= 10000) return `${Math.floor(number / 1000)}k`;
    if (number >= 1000) return `${Math.floor(number / 1000)}k`;
    return number;
  }

  // 날짜 포맷팅
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

  // 게시글 작성 페이지 이동
  document.getElementById('writeBtn').addEventListener('click', () => {
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

  // 초기 게시글 불러오기
  fetchPosts();
});
