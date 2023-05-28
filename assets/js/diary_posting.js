import {
  BACK_BASE_URL,
  FRONT_BASE_URL,
  token,
  creatediary,
  createImg,
  checkPrivate,
} from './api.js'

// 이미지 옵션 선택하기
let list = []; // list 전역변수 선언

async function moodChoice(event){
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

async function placeChoice(event){
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

async function atmosphereChoice(event){
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

async function imgstyleChoice(event){
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

async function cancel(){
  window.location.replace(`${FRONT_BASE_URL}/feed.html`)
}

async function onoff() {
  const isPrivate = document.getElementById("diary_private").checked;
  document.getElementById("private").value = isPrivate;
  console.log(document.getElementById("private").value)
}
