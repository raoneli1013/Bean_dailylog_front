const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


const urlParams = new URLSearchParams(window.location.search);
const diary_id = urlParams.get('id');

let currentUser = null; // 현재 로그인 한 유저를 저장하는 변수

window.onload = async function getDiaryDetail() {
  const response = await fetch(`${backend_base_url}/diary/` + diary_id + '/', { // http://127.0.0.1:5500/diary_detail?id=diary_id 형태로 들어감
    method: 'GET'
  })
  response_json = await response.json()
  console.log("start", response_json)

  const response_user_current = await fetch(`${backend_base_url}/user/dj-rest-auth/user/`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
    },
    method: 'GET',
  });

  const current_user_data = await response_user_current.json();
  currentUser = current_user_data['pk'];



  // 본문 내용
  const title = document.getElementById('title')
  const content = document.getElementById('content')
  const createdDate = document.getElementById('created_date')
  const updatedDate = document.getElementById('updated_date')


  title.innerText = response_json['title']
  content.innerText = response_json['content']
  createdDate.innerText = new Date().toDateString(response_json['created_date']) + " 작성"
  updatedDate.innerText = new Date().toDateString(response_json['updated_date']) + " 수정"

  // user 정보
  const response_user = await fetch(`${backend_base_url}` + '/user/' + response_json['user'] + '/', {
    method: 'GET'
  })
  author = await response_user.json()
  const nickname = document.getElementById('nickname')
  nickname.innerText = "닉네임 : " + author['nickname']


  //key값에 image가 들어왔는지 확인
  //image, default_image인지 확인하여 출력여부 결정
  // json article_img가 profile_img를 가져오는것같아용 확인부탁드립니댱! -소진
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
    feedImage.setAttribute("src", `${backend_base_url}` + `${response_json['article_img']}`)
    imageBox.appendChild(feedImage)

  }



  //유저의 좋아요 정보를 확인하기
  if (localStorage.getItem("payload")) {
    const payload = JSON.parse(localStorage.getItem("payload"));
    const userId = payload.user_id;
    console.log(userId, "페이지 접속유저 아이디")

    //위에 출력한 아이디값이 response_likes 목록안에 있는지
    response_json.zoayo = response_json.likes.includes(userId);
  } else {
    console.log("좋아요 확인중")
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
      editButton.innerText = '수정하기';
      editButton.addEventListener('click', () => editComment(comment['id']));
      commentContainer.appendChild(editButton);

      // 삭제 버튼 추가
      const deleteButton = document.createElement('button');
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
    saveButton.addEventListener('click', () => saveEditedComment(comment['id']));
    editForm.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = '취소';
    cancelButton.addEventListener('click', () => cancelEdit(comment['id']));
    editForm.appendChild(cancelButton);

    diaryComment.appendChild(editForm);

    // console.log("start", response_json)
    // 좋아요 카운트
    $('#likes_count').text(response_json.likes_count);
    $('#bookmark_count').text(response_json.bookmarks_count);

  });

}


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

// 수정하기 버튼클릭
function editComment(id) {
  editingCommentId = id;

  document.getElementById('edit-comment-form').style.display = 'block'; // input 창을 보여줌
  document.getElementById('edit-comment-content').value = '';
}

// 수정된 내용 저장
async function saveEditedComment() {
  const newContent = document.getElementById('edit-comment-content').value;

  const response = await fetch(`${backend_base_url}/diary/comment/${diary_id}/${editingCommentId}/`, {
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
function cancelEdit() {
  // 입력 폼을 숨깁니다.
  document.getElementById('edit-comment-form').style.display = 'none';
  editingCommentId = null;
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



// 좋아요

async function LikeLike() {
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
    // location.reload();
    if (like_image === true) {
      like_image.innerText = `♥`;
    } else if (like_image === false) {

    }
    location.reload();
  }
}








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



