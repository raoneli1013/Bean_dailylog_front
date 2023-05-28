import {
  BACK_BASE_URL,
  FRONT_BASE_URL,
  token,
  LikeLike,
  getDiaryDetail,
  inputComment,
  saveEditedComment,
  deleteComment,
  ClickBookmark,
  editDiary,
  deleteDiary,
} from './api.js'

window.onload = getDiaryDetail()

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
  if (response_json.likes.includes(payload.user_id)) {
    const likeIcon = document.getElementById("like_icon");
    likeIcon.innerText = '❤️';
  } else {
    likeIcon.innerText = '♡';
  }
});
