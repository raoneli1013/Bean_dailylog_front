const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"


/* 게시글 생성하기 */
async function creatediary(){
  const formData = new FormData();

  const title = document.getElementById("diary_title").value
  const content = document.getElementById("diary_content").value

  formData.append( "title", title );
  formData.append( "content", content );
  // 이미지가 있을 때만 데이터를 보냄
  // if (image){
  // formData.append( "image", image );
  // }

  let token = localStorage.getItem("access")
  
  const response = await fetch(`${backend_base_url}/diary/`, {
        method: 'POST',
        headers: {
          "Authorization":`Bearer ${token}`
        },
        body: formData
  })
  
  if (response.status == 200) {
      alert("diary 생성 완료")
      window.location.replace(`${frontend_base_url}/index.html`)
  }else{
    alert(`${response.status}\n제목과 내용을 모두 입력하세요`)
  }
}

async function moodChoice(event){
  document.getElementById('mood').innerText = 
  event.target.value;
  const mood = document.getElementById('mood').innerText
  console.log(mood)
}

async function placeChoice(event){
  document.getElementById('place').innerText = 
  event.target.value;
  const place = document.getElementById('place').innerText
  console.log(place)
}

async function atmosphereChoice(event){
  document.getElementById('atmosphere').innerText = 
  event.target.value;
  const atmosphere = document.getElementById('atmosphere').innerText
  console.log(atmosphere)
}

async function imgstyleChoice(event){
  document.getElementById('imgstyle').innerText = 
  event.target.value;
  const imgstyle = document.getElementById('imgstyle').innerText
  console.log(imgstyle)
}
