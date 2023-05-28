export const BACK_BASE_URL = "http://127.0.0.1:8000";
// export const BACK_BASE_URL = "https://lucedude.link"
export const FRONT_BASE_URL = "http://127.0.0.1:5500";
const token = localStorage.getItem("access");

// 회원가입
export async function handleSignup() {
  const email = document.getElementById("jy-email").value;
  const password1 = document.getElementById("jy-password1").value;
  const password2 = document.getElementById("jy-password2").value;
  const url = `${BACK_BASE_URL}/user/dj-rest-auth/registration/`
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
      window.location.href = `${FRONT_BASE_URL}/login.html`
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

export async function handleLogin() {
  const email = document.getElementById("jy-login-email").value;
  const password = document.getElementById("jy-login-password").value;
  const url = `${BACK_BASE_URL}/user/dj-rest-auth/login/`
  const response = await fetch(url, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      "email": email,
      "password": password
    })
  })
  if (response.ok){
    alert("로그인 완료!");
    const response_json = await response.json()

    localStorage.setItem("access", response_json.access)
    localStorage.setItem("refresh", response_json.refresh)

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // 기존 payload 객체 생성 후 user_id로 정보요청
    const payloadObj = JSON.parse(jsonPayload);
    const userId = payloadObj.user_id
    const response_get_user = await fetch(`${BACK_BASE_URL}/user/${userId}/`, {
      method: "GET",
    })

    // 사용자 정보 객체 생성 후 기존 payload에 추가할 속성 할당
    const response_user_json = await response_get_user.json();
    payloadObj.profile_img = response_user_json.profile_img;
    payloadObj.introduction = response_user_json.introduction;
    payloadObj.nickname = response_user_json.nickname;
    payloadObj.email = response_user_json.email;

    // 업데이트된 payload를 문자열로 변환
    const updatedPayload = JSON.stringify(payloadObj);

    localStorage.setItem("payload", updatedPayload);
    window.location.href = `${FRONT_BASE_URL}/feed.html`
  } else{
    const responseData = await response.json();
      // 키/값 alert으로 출력
      for (let key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          alert(key + ": " + responseData[key]);
        }
  }
}




}

async function getProfile() {
  const response = await fetch(`${BACK_BASE_URL}/user/${user_id}`, {
    headers: {
      "Authorization": "Bearer" + localStorage.getItem("access")
    },
    method: 'GET',
  })
  console.log(response)
}

export async function handlegoogleLogin() {
  const response = await fetch(`${BACK_BASE_URL}/user/google/login`, {
    method: "GET",
  })
};