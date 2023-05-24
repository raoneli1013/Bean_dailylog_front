$(document).ready(function () {
    // 상단 네비 html을 붙여주는 함수
    $("#navbar-container").load("index_nav.html");



    //유저 토큰을 가져와서 로그인시 닉네임 표시
    const payload = localStorage.getItem("payload")

    const payload_parse = JSON.parse(payload)
    console.log(payload)

    // const intro = document.getElementById("intro")
    // intro.innerText = `${payload_parse.nickname}님 안녕하세요`

    // let navbarRight = document.getElementById("navbar-right")
    // let newLi = document.createElement("li")
    // newLi.setAttribute("class", "nav-item")

    // let logoutBtn = document.createElement("button")
    // logoutBtn.setAttribute("class", "nav-link btn")
    // logoutBtn.innerText = "로그아웃"
    // logoutBtn.setAttribute("onclick", "handleLogout()")

    // newLi.appendChild(logoutBtn)

    // navbarRight.appendChild(newLi)

    // let loginbtn = document.getElementById("login-btn")
    // loginbtn.style.display = "none";

    // let signupbtn = document.getElementById("signup-btn")
    // signupbtn.style.display = "none";


});


//유저 로그아웃
async function handleLogout() {
    event.preventDefault();
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.replace('index.html')
}
async function handlecreatearticle() {
    location.href = 'create_article.html'
}