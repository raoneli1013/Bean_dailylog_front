import{
    BACK_BASE_URL,
    FRONT_BASE_URL,
} from './api.js'


$(document).ready(function () {
    // 상단 네비 html을 붙여주는 함수
    $("#navbar-container").load("index_nav.html", function () {

        
        //유저 토큰을 가져와서 로그인시 닉네임 표시
        const payload = localStorage.getItem("payload");
        if (payload) {
        const payload_parse = JSON.parse(payload);

        const intro = document.getElementById("intro");
        if (intro) {
            const payload = localStorage.getItem("payload");
            const payload_parse = JSON.parse(payload);
            intro.innerText = `${payload_parse.nickname}님 안녕하세요`;
            intro.setAttribute('style', 'color: wheat;')
            intro.href = `${FRONT_BASE_URL}/profile2.html`

            let navbarRight = document.getElementById("navbar-right");
            let newLi = document.createElement("li");
            newLi.setAttribute("class", "nav-item");

            //로그아웃 함수
            async function handleLogout() {
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                localStorage.removeItem("payload")
                location.reload()
            }

            //글쓰기 함수
            async function handlecreatearticle() {
                location.href = `${FRONT_BASE_URL}/temp_post.html`
            }

            // 로그인시 보이는 로그아웃
            let logoutBtn = document.createElement("button");
            logoutBtn.setAttribute("class", "nav-link btn");
            logoutBtn.setAttribute("id", "nav-loginout");
            logoutBtn.innerText = "로그아웃";
            logoutBtn.setAttribute("type", "button");
            logoutBtn.setAttribute('style', 'background-color: rgb(145, 104, 74);')

            logoutBtn.addEventListener("click", handleLogout);


            // 로그인시 보이는 글쓰기
            let createarticle = document.getElementById("create-article");
            createarticle.innerText = "글쓰기";
            createarticle.setAttribute("class", "nav-link btn")
            createarticle.setAttribute("id", "nav-create")
            createarticle.setAttribute("type", "button");
            createarticle.setAttribute('style', 'background-color: rgb(73, 51, 35)')

            createarticle.addEventListener("click", handlecreatearticle);


            newLi.appendChild(logoutBtn);

            navbarRight.appendChild(newLi);
        }

        let loginbtn = document.getElementById("login-btn");
        if (loginbtn) {
            loginbtn.style.display = "none";
        }

        let signupbtn = document.getElementById("signup-btn");
        if (signupbtn) {
            signupbtn.style.display = "none";
        }

    }

    });



});