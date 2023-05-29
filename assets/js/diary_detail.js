const backend_base_url = "https://lucedude.link" // 서버 주소
const frontend_base_url = "https://jinyjin7.github.io" //깃허브 페이지 주소
// import { LikeLike, ClickLike } from './diary_api';



const urlParams = new URLSearchParams(window.location.search);
const diary_id = urlParams.get('id');

let currentUser = null; // 현재 로그인 한 유저를 저장하는 변수

window.onload = async function getDiaryDetail() {
  const response = await fetch(`${backend_base_url}/diary/` + diary_id + '/', { // http://127.0.0.1:5500/diary_detail?id=diary_id 형태로 들어감
    method: 'GET'
  })
  const payload = JSON.parse(localStorage.getItem('payload'));

  response_json = await response.json()
  const response_user_current = await fetch(`${backend_base_url}/user/dj-rest-auth/user/`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
    },
    method: 'GET',

  });



  const current_user_data = await response_user_current.json();
  console.log("corrunt", response_user_current)
  currentUser = current_user_data['pk'];



  // 본문 내용
  const title = document.getElementById('title')
  const content = document.getElementById('content')
  const createdDate = document.getElementById('created_date')
  const updatedDate = document.getElementById('updated_date')

  // 본문컨텐츠 추가
  title.innerText = response_json['title']
  content.innerText = response_json['content']
  createdDate.innerText = new Date().toDateString(response_json['created_date']) + " 작성"
  updatedDate.innerText = new Date().toDateString(response_json['updated_date']) + " 수정"

  // 수정 및 삭제 버튼 보여주기
  const editDiaryButton = document.getElementById('edit-diary-button');
  const deleteDiaryButton = document.getElementById('delete-diary-button');

  if (currentUser === response_json['user']) {
    editDiaryButton.style.display = 'block';
    deleteDiaryButton.style.display = 'block';
  } else {
    editDiaryButton.style.display = 'none';
    deleteDiaryButton.style.display = 'none';
  }

  // user 정보
  const response_user = await fetch(`${backend_base_url}` + '/user/' + response_json['user'] + '/', {
    method: 'GET'
  })
  author = await response_user.json()
  const nickname = document.getElementById('nickname')
  nickname.setAttribute('id', 'nickname')
  nickname.setAttribute('class', 'link-success')
  nickname.setAttribute('href', `${frontend_base_url}/profile.html?id=${diary_id}`)
  nickname.innerText = `${nickname}`;
  nickname.innerText = "작성자 닉네임 : " + author['nickname']
  console.log("??", author)



  //key값에 image가 들어왔는지 확인
  //image, default_image인지 확인하여 출력여부 결정
  if (response_json['article_img'] === null) {
    const imageBox = document.getElementById('image-box');
    const feedImage = document.createElement("img")
    feedImage.setAttribute('class', 'imagecard')
    feedImage.setAttribute("src", "/assets/images/default_image.jpg")
    imageBox.appendChild(feedImage)
  } else {
    //image가 있으면 넣어주기
    const imageBox = document.getElementById('image-box');
    const feedImage = document.createElement("img")
    feedImage.setAttribute('class', 'imagecard')
    feedImage.setAttribute("src", `${response_json['article_img']}`)
    imageBox.appendChild(feedImage)

  }




  // 댓글 보기
  const response_comment = await fetch(`${backend_base_url}/diary/comment/${diary_id}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
    },
    method: "GET"
  })
  const response_json_comment = await response_comment.json()
  console.log("comment", response_json_comment)

  const diaryComment = document.getElementById("diary_comment");
  // 코멘트 찾아서 붙여주기
  response_json_comment.forEach(comment => {
    const commentContainer = document.createElement('div');
    commentContainer.setAttribute('class', 'comment-container');

    const commentUser = document.createElement('p');
    commentUser.innerText = comment['name'];
    commentContainer.appendChild(commentUser);

    const commentContent = document.createElement('p');
    commentContent.innerText = comment['content'];
    commentContent.setAttribute('id', `comment-content-${comment['id']}`);
    commentContainer.appendChild(commentContent);

    if (comment['user'] === currentUser) {
      // 수정하기 버튼 추가
      const editButton = document.createElement('button');
      editButton.setAttribute('id', 'edit-buttun')
      editButton.setAttribute('class', 'btn btn-primary')
      editButton.setAttribute('style', 'background-color:rgb(73, 51, 35);')
      editButton.innerText = '수정하기';
      editButton.addEventListener('click', () => editComment(comment['id']));
      commentContainer.appendChild(editButton);

      // 삭제 버튼 추가
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('id', 'edit-buttun')
      deleteButton.setAttribute('class', 'btn btn-primary')
      deleteButton.setAttribute('style', 'background-color: rgb(145, 104, 74)')
      deleteButton.innerText = '삭제';
      deleteButton.addEventListener('click', () => deleteComment(comment['id']));
      commentContainer.appendChild(deleteButton);
    }

    diaryComment.appendChild(commentContainer);

    // 수정할 내용을 입력받을 폼 
    const editForm = document.createElement('div');
    editForm.setAttribute('class', 'edit-form');
    editForm.setAttribute('id', `edit-form-${comment['id']}`);
    editForm.style.display = 'none';

    const editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.setAttribute('id', `edit-input-${comment['id']}`);
    editForm.appendChild(editInput); 

    const saveButton = document.createElement('button');
    saveButton.innerText = '저장';
    saveButton.setAttribute('class', 'btn btn-primary')
    saveButton.setAttribute('style', 'background-color:rgb(73, 51, 35);')
    saveButton.addEventListener('click', () => saveEditedComment(comment['id']));
    editForm.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = '취소';
    cancelButton.setAttribute('class', 'btn btn-primary')
    cancelButton.setAttribute('style', 'background-color: rgb(145, 104, 74)')
    cancelButton.addEventListener('click', () => cancelEdit(comment['id']));
    editForm.appendChild(cancelButton);

    diaryComment.appendChild(editForm);



    // 좋아요 카운트
    $('#likes_count').text(response_json.likes_count);
    $('#bookmark_count').text(response_json.bookmarks_count);

  });

}

// 댓글 입력 함수
async function inputComment() {
  const comment_content = document.getElementById("comment-content").value
  const response_input = await fetch(`${backend_base_url}/diary/comment/${diary_id}/`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
      'content-type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify({
      "content": comment_content,
    })
  })
  location.reload()

}

let editingCommentId = null;

// 댓글 수정하기 버튼클릭
function editComment(id) {
  const commentContent = document.getElementById(`comment-content-${id}`);
  const editForm = document.getElementById(`edit-form-${id}`);
  const editInput = document.getElementById(`edit-input-${id}`);

  // 댓글 내용을 인풋창으로 변경
  editInput.value = commentContent.innerText;
  commentContent.style.display = 'none';
  editForm.style.display = 'block';
}

// 수정된 댓글 내용 저장
async function saveEditedComment(id) {
  const newContent = document.getElementById(`edit-input-${id}`).value;

  const response = await fetch(`${backend_base_url}/diary/comment/${diary_id}/${id}/`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      content: newContent,
    }),
  });

  location.reload();
}

// 수정 취소
function cancelEdit(id) {
  const commentContent = document.getElementById(`comment-content-${id}`);
  const editForm = document.getElementById(`edit-form-${id}`);
  const editInput = document.getElementById(`edit-input-${id}`);

  // 인풋창을 숨기고 원래의 댓글 내용을 보여줌
  commentContent.style.display = 'block';
  editForm.style.display = 'none';
  editInput.value = '';
}

// 댓글 삭제
async function deleteComment(id) {
  editingCommentId = id;
  const response = await fetch(`${backend_base_url}/diary/comment/${diary_id}/${editingCommentId}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    },
    method: 'DELETE',
  });

  // 페이지를 새로고침합니다.
  location.reload();


}



// 좋아요 클릭시 이벤트 발생
const likeButtonClick = document.querySelector('#like_images')

likeButtonClick.addEventListener('click', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const DIARY_ID = urlParams.get('diary_id');

  // 좋아요 상태 업데이트
  await LikeLike(diary_id);

  //diary 정보 다시 가져오기
  const diary = await getDiaryDetail(diary_id);

  //좋아요 여부에 따라 하트 변경
  // if (response_json.likes.includes(payload.user_id)) {
  //   const likeIcon = document.getElementById("like_icon");
  //   likeIcon.innerText = '❤️';
  // } else {
  //   likeIcon.innerText = '♡';
  // }
});



// //좋아요 -> diary_api.js로 이동

export async function LikeLike() {
  const response = await fetch(`${backend_base_url}/diary/${diary_id}/likes/`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access"),
      'content-type': 'application/json',
    },
    method: 'POST',
  })

  response_json = await response.json()
  console.log("start", response_json)
  const like_image = response_json.likes_image
  console.log(like_image)


  if (response.status === 200) {
    alert("하튜")
    if (like_image === true) {
    } else if (like_image === false) {

    }
    location.reload();
  }
}

// // 준열님 코드 참고해서 다시작성
// // 로그인이 안되어서 제대로 실행되는지 알 수 없는 상태라 약간 안전빵 느낌으로 
// // 준열님 코드를 클론코딩해보았습니다.. -소진
// export async function ClickLike(diary_id) {
//   const url = `${BACK_BASE_URL}/diary/${diary_id}/likes/`;
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer` + localStorage.getItem("access"),
//         'content-type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Request failed");
//     }

//     console.log("Request succeeded");
//   } catch (error) {
//     console.error("Request failed:", error.message);
//   }
// }








async function ClickBookmark() {
  const response = await fetch(`${backend_base_url}/diary/${diary_id}/bookmark/`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access"),
      'content-type': 'application/json',
    },
    method: 'POST',
  })
  if (response.status === 200) {
    alert("bookmark")
    location.reload();
  }

}

//다이어리 수정 
async function editDiary() {
  const editButton = document.getElementById('edit-diary-button');
  const title = document.getElementById('title');
  const content = document.getElementById('content');

  if (editButton.innerText === '수정') {
    // 수정 모드로 변경
    editButton.innerText = '저장';

    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'updated-title');
    titleInput.value = title.innerText;
    title.innerText = '';
    title.appendChild(titleInput);

    const contentInput = document.createElement('textarea');
    contentInput.setAttribute('id', 'updated-content');
    contentInput.value = content.innerText;
    content.innerText = '';
    content.appendChild(contentInput);

  } else {
    // 저장 모드로 변경
    const updatedTitle = document.getElementById('updated-title').value;
    const updatedContent = document.getElementById('updated-content').value;

    const response = await fetch(`${backend_base_url}/diary/${diary_id}/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access'),
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent,
        article_img : `${response_json['article_img']}`
      }),
    });

    if (response.status === 200) {
      // 수정된 내용을 받아와서 디테일 페이지를 다시 로드
      window.location.href = `${frontend_base_url}/diary_detail.html?id=${diary_id}`;
    } else {
      alert('게시글 수정에 실패했습니다.');
    }
  }
}


// 게시글 삭제 버튼 클릭 시
async function deleteDiary() {
  const confirmDelete = confirm("게시글을 삭제하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(`${backend_base_url}/diary/${diary_id}/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access'),
      },
      method: 'DELETE',
    });

    if (response.status === 204) { // 삭제 완료 204 나오면 삭제
      alert("게시글이 삭제되었습니다.");
      window.location.href = `${frontend_base_url}/feed.html`; // 피드페이지로 돌려보냄
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }
}
