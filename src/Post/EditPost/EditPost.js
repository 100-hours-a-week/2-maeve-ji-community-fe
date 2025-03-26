// document.addEventListener('DOMContentLoaded', () => {
//   const title = document.getElementById('title');
//   const content = document.getElementById('content');
//   const imageUpload = document.getElementById('imageUpload');
//   const updateBtn = document.getElementById('updateBtn');
//   const backBtn = document.getElementById('backBtn');

//   const urlParams = new URLSearchParams(window.location.search);
//   const postId = urlParams.get('postId');  // ✅ URL에서 post_id 추출
//   console.log("postId: ", postId);

//   // 게시글 불러오기 (실제 API로 교체)
//   fetch(`http://localhost:8080/posts/${postId}`)
//     .then(res => res.json())
//     .then(data => {
//       const post = data.data.data;
//       renderPost(post);
//     })
//     .catch(err => console.error('게시글 로드 실패', err));

//   function renderPost(post) {
//     title.value = post.title;
//     content.value = post.contents;
//     // 이미지 프리뷰 필요하면 추가 구현 가능
//   }

//   // 유효성 검사
//   function validate() {
//     if (title.value.trim() && content.value.trim()) {
//       updateBtn.disabled = false;
//       updateBtn.style.backgroundColor = '#7F6AEE';
//       updateBtn.style.cursor = 'pointer';
//     } else {
//       updateBtn.disabled = true;
//       updateBtn.style.backgroundColor = '#ACA0EB';
//       updateBtn.style.cursor = 'not-allowed';
//     }
//   }
//   [title, content].forEach(input => input.addEventListener('input', validate));

//   updateBtn.addEventListener('click', async (e) => {
//     e.preventDefault();
  
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     console.log('Modifiedtitle: ', title.value.trim());
//     console.log('ModifiedContent: ', content.value.trim());
    
//     formData.append('title', title.value.trim());
//     formData.append('content', content.value.trim());
//     if (imageUpload.files[0]) {
//       console.log('ModifiedUrl: ', imageUpload.files[0]);
//       formData.append('image', imageUpload.files[0]);
//     }
  
//     try {
//       const response = await fetch(`http://localhost:8080/posts/${postId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': 'Bearer ' + token
//         },
//         body: formData
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("서버 응답 에러:", errorText);
//         throw new Error('게시글 수정 실패');
//       }
      
//       const resData = await response.json();
//       alert('게시글이 수정되었습니다!');
//       location.href = `../Post/Post.html?post_id=${postId}`;
//     } catch (err) {
//       console.error(err);
//       alert('게시글 수정 중 오류가 발생했습니다.');
//     }
//   });
  
//   // // 수정 요청
//   // document.getElementById('editForm').addEventListener('submit', async (e) => {
//   //   e.preventDefault();

//   //   const token = localStorage.getItem('token'); // ✅ JWT token 가져오기
//   //   const formData = new FormData();
//   //   formData.append('title', title.value.trim());
//   //   formData.append('content', content.value.trim());  // ✅ 백엔드 필드명 확인 (contents로 가정)
//   //   if (imageUpload.files[0]) {
//   //     formData.append('image', imageUpload.files[0]);
//   //   }

//   //   try {
//   //     const response = await fetch(`http://localhost:8080/posts/${postId}`, {
//   //       method: 'PUT',
//   //       headers: {
//   //         'Authorization': 'Bearer ' + token
//   //       },
//   //       body: formData
//   //     });

//   //     const resData = await response.json();

//   //     if (!response.ok) {
//   //       console.error(resData);
//   //       throw new Error('게시글 수정 실패');
//   //     }

//   //     alert('게시글이 수정되었습니다!');
//   //     // ✅ 수정 후 상세 페이지로 이동
//   //     location.href = `../Post/Post.html?post_id=${postId}`;
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert('게시글 수정 중 오류가 발생했습니다.');
//   //   }
//   // });

//   backBtn.addEventListener('click', () => {
//     location.href = '../Posts/Posts.html';
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editPostForm');
  form.addEventListener('submit', e => e.preventDefault()); // ✅ form 기본 제출 막기

  const updateBtn = document.getElementById('updateBtn');

  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // ✅ 혹시 모를 중복 방지

    const token = localStorage.getItem('token');
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageUpload = document.getElementById('imageUpload');
    const postId = new URLSearchParams(window.location.search).get('postId');

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
