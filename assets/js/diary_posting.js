const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"


/* 게시글 생성하기 */
async function creatediary() {
  const formData = new FormData();

  const title = document.getElementById("diary_title").value
  const content = document.getElementById("diary_content").value

  formData.append("title", title);
  formData.append("content", content);

  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/diary/`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  })

  if (response.status == 201) {
    alert("diary 생성 완료")
    window.location.replace(`${frontend_base_url}/feed.html`)
  } else {
    alert(`${response.status}\n제목과 내용을 모두 입력하세요`)
  }
}


// 이미지 옵션 선택하기
let list = []; // list 전역변수 선언

async function moodChoice(event) {
  document.getElementById('mood').innerText =
    event.target.value;
  const mood = document.getElementById('mood').innerText

  const index = list.indexOf(mood); //중복제거
  if (index > -1) {
    list.splice(index, 1);
  }

  list.push(mood)
  console.log(mood)
  console.log(list)

  return list;


}

async function placeChoice(event) {
  document.getElementById('place').innerText =
    event.target.value;
  const place = document.getElementById('place').innerText

  // list = [place];

  const index = list.indexOf(place);
  if (index > -1) {
    list.splice(index, 1);
  }

  list.push(place)

  console.log(place)
  console.log(list)
  return list;

}

async function atmosphereChoice(event) {
  document.getElementById('atmosphere').innerText =
    event.target.value;
  const atmosphere = document.getElementById('atmosphere').innerText

  // list = [atmosphere];

  const index = list.indexOf(atmosphere);
  if (index > -1) {
    list.splice(index, 1);
  }

  list.push(atmosphere)

  console.log(atmosphere)
  console.log(list)
  return list;

}

async function imgstyleChoice(event) {
  document.getElementById('imgstyle').innerText =
    event.target.value;
  const imgstyle = document.getElementById('imgstyle').innerText

  // list = [imgstyle];

  const index = list.indexOf(imgstyle);
  if (index > -1) {
    list.splice(index, 1);
  }

  list.push(imgstyle)

  console.log(imgstyle)
  console.log(list)
  return list;

}

// function test(){
//   option = []
//   moodChoice(event).then(result => option.push(result[0]))
//   placeChoice(event).then(result => option.push(result[1]))
//   atmosphereChoice(event).then(result => option.push(result[2]))
//   imgstyleChoice(event).then(result => option.push(result[3]))
//   console.log(option)
// }
// console.log(list)

// AI이미지 불러오기

async function createImg() {
  const formdata = new FormData();

  const prompt = list

  formdata.append("prompt", prompt)
  console.log(prompt)

  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/diary/images/`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formdata
  })
  console.log(prompt)
}

async function cancel() {
  window.location.replace(`${frontend_base_url}/feed.html`)
}

async function onoff() {
  const isPrivate = document.getElementById("diary_private").checked;
  document.getElementById("private").value = isPrivate;
  console.log(document.getElementById("private").value)
}

// 비밀글

async function checkPrivate(event, diary_private) {
  const token = localStorage.getItem("access");
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload)

  const isPrivate = document.getElementById("diary_private").checked;
  document.getElementById("private").value = isPrivate;

  if (document.getElementById("private").value === "true") {
    event.preventDefault(); // 비공개 다이어리면 우선 상세페이지로 이동을 막음
    const formData = new FormData();

    const is_private = document.getElementById("private").value

    formData.append("is_private", is_private);

    // 비밀 게시물의 작성자인지 확인
    fetch(`${backend_base_url}/diary/${diary.id}`, {
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
          window.location.href = `${frontend_base_url}/diary/${diary.id}`;
        } else {
          console.log(`작성자 본인만 볼 수 있는 게시물 입니다.`);
        }
      })
      .catch(error => {
        console.error("작성자 확인 요청 중 오류가 발생했습니다:", error);
      });
  } else {
    // 게시물 상세 페이지로 이동
    window.location.href = `${frontend_base_url}/diary/${diary.id}`;
  }
}