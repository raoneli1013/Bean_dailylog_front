export const BACK_BASE_URL = "http://127.0.0.1:8000";
export const FRONT_BASE_URL = "http://127.0.0.1:5500";
export const token = localStorage.getItem("access");

// 회원가입
export async function handleSignup() {
  const email = document.getElementById("jy-email").value;
  const password1 = document.getElementById("jy-password1").value;
  const password2 = document.getElementById("jy-password2").value;
  const url = `${BACK_BASE_URL}/user/dj-rest-auth/registration/`;
  if (password1 === password2) {
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
        password1: password1,
        password2: password2,
      }),
    });

    // 회원 가입 성공 또는 실패에 따른 처리
    if (response.ok) {
      // 회원 가입 성공
      alert("인증 메일을 보냈습니다. 메일함을 확인해주세요.");
      window.location.href = `${FRONT_BASE_URL}/login.html`;
    } else {
      // 회원 가입 실패
      const responseData = await response.json();
      // 키/값 alert으로 출력
      for (let key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          alert(key + ": " + responseData[key]);
        }
      }
      alert("회원 가입에 실패하였습니다.");
    }
  } else {
    // 비밀번호 불일치
    alert("비밀번호가 일치하지 않습니다.");
  }
}

// 일반 로그인
export async function handleLogin() {
  const email = document.getElementById("jy-login-email").value;
  const password = document.getElementById("jy-login-password").value;
  const url = `${BACK_BASE_URL}/user/dj-rest-auth/login/`;
  const response = await fetch(url, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (response.ok) {
    alert("로그인 완료!");
    const response_json = await response.json();

    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // 기존 payload 객체 생성 후 user_id로 정보요청
    const payloadObj = JSON.parse(jsonPayload);
    const userId = payloadObj.user_id;
    const response_get_user = await fetch(`${BACK_BASE_URL}/user/${userId}/`, {
      method: "GET",
    });

    // 사용자 정보 객체 생성 후 기존 payload에 추가할 속성 할당
    const response_user_json = await response_get_user.json();
    payloadObj.profile_img = response_user_json.profile_img;
    payloadObj.introduction = response_user_json.introduction;
    payloadObj.nickname = response_user_json.nickname;
    payloadObj.email = response_user_json.email;

    // 업데이트된 payload를 문자열로 변환
    const updatedPayload = JSON.stringify(payloadObj);

    localStorage.setItem("payload", updatedPayload);
    window.location.href = `${FRONT_BASE_URL}/feed.html`;
  } else {
    const responseData = await response.json();
    // 키/값 alert으로 출력
    for (let key in responseData) {
      if (responseData.hasOwnProperty(key)) {
        alert(key + ": " + responseData[key]);
      }
    }
  }
}

// 프로필 조회
export async function getProfile() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const users_id = payload_parse.user_id
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/user/${users_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  const data = await response.json();
  return data;
}

// 구글 로그인 요청
export async function handlegoogleLogin() {
  const response = await fetch(`${BACK_BASE_URL}/user/google/login`, {
    method: "GET",
  });
}

// payload 업데이트
export async function updatePayload() {
  // URL에서 쿼리 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("access")) {
    const accessToken = urlParams.get("access");
    const refreshToken = urlParams.get("refresh");

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    const base64Url = accessToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    // 기존 payload 객체 생성 후 user_id로 정보요청
    const payloadObj = JSON.parse(jsonPayload);
    const userId = payloadObj.user_id;
    const response_get_user = await fetch(`${BACK_BASE_URL}/user/${userId}/`, {
      method: "GET",
    });

    // 사용자 정보 객체 생성 후 기존 payload에 추가할 속성 할당
    const response_user_json = await response_get_user.json();
    payloadObj.profile_img = response_user_json.profile_img;
    payloadObj.introduction = response_user_json.introduction;
    payloadObj.nickname = response_user_json.nickname;
    payloadObj.email = response_user_json.email;

    // 업데이트된 payload를 문자열로 변환
    const updatedPayload = JSON.stringify(payloadObj);

    localStorage.setItem("payload", updatedPayload);
  }
}

// diary 좋아요
export async function LikeLike() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/likes/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  response_json = await response.json();
  const like_image = response_json.likes_image;

  if (response.status === 200) {
    alert("하튜");
    if (like_image === true) {
    } else if (like_image === false) {
    }
    location.reload();
  }
}

// diary bookmark
export async function loadingBookmark() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const user_id = payload_parse.user_id;
  fetch(`${BACK_BASE_URL}/diary/${user_id}/bookmark/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      $("#bookmark-box").empty();
      data.forEach((a) => {
        let title = a["title"];
        let img = a["article_img"];
        let id = a["id"];
        let temp_html = `<div class="col mb-5">
              <div class="card h-100">
                  <img class="card-img-top" src="${img}" alt="..." />
                      <!-- 포스팅 카드가 보여지는 곳-->
                  <div class="card-body p-4">
                      <div class="text-center">
                          <!-- 게시글 title-->
                          <h5 class="fw-bolder">${title}</h5>
                          <!-- 게시글 작성자-->
                          <hr>
                              <label for="" class="">${user}</label>
                      </div>
                  </div>
                  <!-- 보러가기 버튼-->
                  <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div class="text-center"><a class="btn me-2 btn_org"
                          href="${FRONT_BASE_URL}/diary_detail.html?id=${id}">보러가기</a></div>
                  </div>
              </div>
          </div>`;
        $("#article-box").append(temp_html);
      });
    });
}

// diary detail
export async function getDiaryDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/`, {
    method: 'GET'
  })

  response_json = await response.json()
  const response_user_current = await fetch(`${BACK_BASE_URL}/user/dj-rest-auth/user/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const current_user_data = await response_user_current.json();
  const currentUser = current_user_data['pk'];

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
  const response_user = await fetch(`${BACK_BASE_URL}` + '/user/' + response_json['user'] + '/', {
    method: 'GET'
  })
  author = await response_user.json()
  const nickname = document.getElementById('nickname')
  nickname.innerText = "작성자 닉네임 : " + author['nickname']

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
    feedImage.setAttribute("src", `${response_json['article_img']}`)
    imageBox.appendChild(feedImage)
  }

  // 댓글 보기
  const response_comment = await fetch(`${BACK_BASE_URL}/diary/comment/${diary_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    method: "GET"
  })
  const response_json_comment = await response_comment.json()
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
export async function inputComment() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const comment_content = document.getElementById("comment-content").value
  const response_input = await fetch(`${BACK_BASE_URL}/diary/comment/${diary_id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify({
      "content": comment_content,
    })
  })
  location.reload()
}

// 수정된 댓글 내용 저장 
export async function saveEditedComment(id) {
  const newContent = document.getElementById(`edit-input-${id}`).value;
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const response = await fetch(`${BACK_BASE_URL}/diary/comment/${diary_id}/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      content: newContent,
    }),
  });

  location.reload();
}

// 댓글 삭제 요청
export async function deleteComment(id) {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const response = await fetch(`${BACK_BASE_URL}/diary/comment/${diary_id}/${id}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    },
    method: 'DELETE',
  });
  // 페이지를 새로고침합니다.
  location.reload();
}

// 북마크 클릭 시
export async function ClickBookmark() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/bookmark/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
      'content-type': 'application/json',
    },
    method: 'POST',
  })
  if (response.status === 200) {
    alert("bookmark")
    location.reload();
  }
}

//다이어리 수정 요청
export async function editDiary() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
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

    const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access'),
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent,
      }),
    });

    if (response.status === 200) {
      // 수정된 내용을 받아와서 디테일 페이지를 다시 로드
      window.location.href = `${FRONT_BASE_URL}/diary_detail.html?id=${diary_id}`;
    } else {
      alert('게시글 수정에 실패했습니다.');
    }
  }
}

// 게시글 삭제 요청
export async function deleteDiary() {
  const urlParams = new URLSearchParams(window.location.search);
  const diary_id = urlParams.get('id');
  const confirmDelete = confirm("게시글을 삭제하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access'),
      },
      method: 'DELETE',
    });

    if (response.status === 204) { // 삭제 완료 204 나오면 삭제
      alert("게시글이 삭제되었습니다.");
      window.location.href = `${FRONT_BASE_URL}/feed.html`; // 피드페이지로 돌려보냄
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }
}

// 게시글 생성
export async function creatediary(){
  const formData = new FormData();

  const title = document.getElementById("diary_title").value
  const content = document.getElementById("diary_content").value

  formData.append( "title", title );
  formData.append( "content", content );

  let token = localStorage.getItem("access")
  
  const response = await fetch(`${BACK_BASE_URL}/diary/`, {
        method: 'POST',
        headers: {
          "Authorization":`Bearer ${token}`
        },
        body: formData
  })

  if (response.status == 201) {
      alert("diary 생성 완료")
      window.location.replace(`${FRONT_BASE_URL}/feed.html`)
  }else{
    alert(`${response.status}\n제목과 내용을 모두 입력하세요`)
  }
}

// 이미지 생성 요청
export async function createImg(){
  const formdata = new FormData();
  const prompt = list
  formdata.append("prompt",prompt)
  const response = await fetch(`${BACK_BASE_URL}/diary/images/`,{
    method: 'POST',
    headers: {
      "Authorization":`Bearer ${token}`
    },
    body: formdata
  })
}

// 비밀글
export async function checkPrivate(event, diary_private) {
  const token = localStorage.getItem("access");
  const isPrivate = document.getElementById("diary_private").checked;
  document.getElementById("private").value = isPrivate;
  
  if (document.getElementById("private").value === "true") {
    event.preventDefault(); // 비공개 다이어리면 우선 상세페이지로 이동을 막음
    const formData = new FormData();

    const is_private = document.getElementById("private").value

    formData.append("is_private", is_private);

    // 비밀 게시물의 작성자인지 확인
    fetch(`${BACK_BASE_URL}/diary/${diary.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // 토큰을 헤더에 포함하여 보냄
      },
      body: formData // 게시물 ID를 요청 바디에 포함하여 보냄
    })
      .then(response => response.json())
      .then(data => {
        if (data.user_id === request.user_id) {
          // 작성자 본인인 경우 게시물 상세 페이지로 이동
          window.location.href = `${FRONT_BASE_URL}/diary/${diary.id}`;
        } else {
          alert(`작성자 본인만 볼 수 있는 게시물 입니다.`);
        }
      })
      .catch(error => {
        alert("작성자 확인 요청 중 오류가 발생했습니다:", error);
      });
  } else {
    // 게시물 상세 페이지로 이동
    window.location.href = `${FRONT_BASE_URL}/diary/${diary.id}`;
  }
}

// 원래 반영되어있던 내용을 가져와서 보여줌
export async function BeforeProfile() {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const users_id = payload_parse.user_id
  const response = await fetch(`${BACK_BASE_URL}/user/${users_id}/`, {
      method: 'GET',
  });
  const response_json = await response.json();
  $('#nickname').text(response_json.nickname);
  $('#email').text(response_json.email);
  $('#diary_count').text(response_json.my_diary.length);
  $('#likes_count').text(response_json.likes_diary.length);
  $('#bookmarked_diary_count').text(response_json.bookmark_diary.length);
  $('#followings').text(response_json.followings.length);
  $('#followers').text(response_json.followers.length);
  $('#introduction').text(response_json.introduction);
}

// 프로필 수정
export async function ProfileUpdate() {

  const nickname = document.getElementById('nickname').value;
  const introduction = document.getElementById('introduction').value;
  const token = localStorage.getItem("access");

  const formData = new FormData();
  formData.append("nickname", nickname);
  formData.append("introduction", introduction);

  const imageInput = document.getElementById("image-input");
  const img = imageInput.files[0]; 

  if (img) {
      formData.append("profile_img", img);
  }

  const response = await fetch(`${BACK_BASE_URL}/user/`, {
      method: "PUT",
      headers: {
          Authorization: "Bearer " + token,
      },
      body: formData,
  });

  if (response.status == 200) {
      alert("프로필 수정 완료")
      window.location.href = "profile2.html";
  } else if (nickname == '' || introduction == '') {
      alert("빈칸을 입력해 주세요.")
  } else {
      console.error("요청 실패:", response);
  }
}

// 프로필 불러오기
export async function getfile() {
  const profile = await getProfile();

  const me_id = profile.id;
  const nickname = profile.nickname;

  //내가 들어왔을 때,일단 팔로우팔로잉 표기해놨습니다 - 추후 수정예정
  if (me_id == profile.id) {
      $('.hidden').hide();
      $('.promission').show();
      $('.permission2').show();
      $('.withdrawal').show();
  } else {
      //다른유저가 마이프로필 방문(팔로우,팔로잉만 표기)
      $('.permission2').show();
  }

  // 이미지가 없거나 null 또는 오류일때 기본이미지는 저희 로고~
  if (profile.profile_img == '' || profile.profile_img == null || typeof profile.profile_img === 'undefined') {
      $('#img').attr('src', './assets/images/diary.png');
  } else {
      $('#img').attr('src', `${BACK_BASE_URL}${profile.profile_img}`);
  }

  //닉네임, 이메일, 내가 작성한 글, 내가 좋아요한 글, 북마크한 글, 팔로잉, 팔로워 표기
  $('#nickname').text(profile.nickname);
  $('#email').text(profile.email);
  $('#diary_count').text(profile.my_diary.length);
  $('#likes_count').text(profile.likes_diary.length);
  $('#bookmarked_diary_count').text(profile.bookmark_diary.length);
  $('#followings').text(profile.followings.length);
  $('#followers').text(profile.followers.length);
  $('#introduction').text(profile.introduction);

  // 팔로우 목록에 닉네임이 포함되어있는지 검사 (includes는 특정요소가 해당 배열안에있는지 확인)
  profile.followers.includes(nickname)
  const isAccountInArray = profile.followers.includes(nickname);

  if (isAccountInArray) {
      // 팔로우가 되어 있다면
      $('#follow-btn').hide(); // '팔로우하기'를 숨김.
      $('#following-btn').show(); // '팔로잉'을 보여줌.
  }
  else {
      // 팔로우가 되어 있지 않다면
      $('#follow-btn').show(); // '팔로우하기'를 보여줌.
      $('#following-btn').hide(); // '팔로잉'을 숨김.
  }

  // 팔로워 버튼 누를시 팔로우 , 본인은 팔로우 못함
  document.querySelector('#follow-btn').addEventListener('click', async function () {
      try {
          const response = await fetch(`${BACK_BASE_URL}/user/follow/${users_id}/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('access')
              }
          });

          if (response.ok) {
              alert('팔로우 되었습니다.');
              location.reload();
          } else {
              alert('본인은 팔로우할 수 없습니다ㅠ');
              location.reload();
          }
      } catch (error) {
        alert('오류 발생:', error);
          location.reload();
      }
  });
}

// 회원탈퇴 요청
export async function UserDelete() {
  if (confirm("삭제하시겠습니까?")) {
      const response = await fetch(`${BACK_BASE_URL}/user/`, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("access"),
              'content-type': 'application/json',
          },
          method: 'DELETE',
      })
      if (response.status == 204) {
          alert("삭제 완료!")
          location.assign('login.html')
      } else {
          alert("권한이 없습니다.")
      }
  }
}

// 프로필 북마크 게시글 불러오기
export async function LoadBookmark() {
  const urlParams = new URLSearchParams(window.location.search);
const diary_id = urlParams.get('id');
    const response = await fetch(`${BACK_BASE_URL}/diary/${diary_id}/bookmark/`, {
        headers: {
            "Authorization": "Bearer" + localStorage.getItem("access")
        }
        , method: 'GET',
    });

    const data = await response.json();

    $('#bookmark-box').empty();

    data.forEach((a) => {
        let title = a['title'];
        let img = a['article_img'];
        let nickname = a['nickname'];

        let temp_html = `<div class="col mb-5">
            <div class="card h-100">
                <img class="card-img-top" src="${img}" alt="..." />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${title}</h5>
                        <hr>
                        <label for="" class="">${nickname}</label>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <a class="btn" href="${FRONT_BASE_URL}/diary_detail.html?id=${id}">보러가기</a>
                    </div>
                </div>
            </div>
        </div>`;

        $('#bookmark-box').append(temp_html);
    });
}
