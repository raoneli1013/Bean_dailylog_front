const front_base_url = "https://jinyjin7.github.io/"
const backend_base_url = "https://lucedude.link"
// const front_base_url = "http://127.0.0.1:5500"
// const backend_base_url = "http://127.0.0.1:8000"


console.log("프로필 api")

// 수정버튼으로 수정폼으로 이동
function redirectUpdatePage() {
    console.log("프로필 api22")
    window.location.href = `${front_base_url}/profile2_update.html`;

}

function ProfileNoUpdate() {
    window.location.href = `profile2.html`;
}




// 원래 반영되어있던 내용을 가져와서 보여줌
async function BeforeProfile(user_id) {

    const response = await fetch(`${backend_base_url}/user/${id}/`, {
        method: 'GET',
    });

    response_json = await response.json();
    console.log(response_json)


    $('#nickname').text(response_json.nickname);
    $('#email').text(response_json.email);
    $('#diary_count').text(response_json.my_diary.length);
    $('#likes_count').text(response_json.likes_diary.length);
    $('#bookmarked_diary_count').text(response_json.bookmark_diary.length);
    $('#followings').text(response_json.followings.length);
    $('#followers').text(response_json.followers.length);
    $('#introduction').text(response_json.introduction);

}



//프로필 수정
async function ProfileUpdate() {
    const nickname = document.getElementById('nickname').value;
    const introduction = document.getElementById('introduction').value;
    // const imageInput = document.getElementById("image-input");
    // const img = document.getElementById('profile_img').files[0]
    const token = localStorage.getItem("access");


    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("introduction", introduction);

    const imageInput = document.getElementById("image-input");
    const img = imageInput.files[0]; // 파일 업로드 input에서 선택한 파일 가져오기

    if (img) {
        formData.append("profile_img", img);
    }

    const response = await fetch(`${backend_base_url}/user/`, {
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


const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
const diary_id = urlParams.get('id');
console.log(diary_id)

// let currentUser = null; // 현재 로그인 한 유저를 저장하는 변수

// 프로필 북마크 게시글 불러오기
async function LoadBookmark() {
    console.log("버튼누름")
    const response = await fetch(`${backend_base_url}/diary/` + diary_id + `/bookmark/`, {
        headers: {
            "Authorization": "Bearer" + localStorage.getItem("access")
        }
        , method: 'GET',
    });

    const data = await response.json();

    console.log(data);

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
                        <a class="btn" href="${frontend_base_url}/diary_detail.html?id=${id}">보러가기</a>
                    </div>
                </div>
            </div>
        </div>`;

        $('#bookmark-box').append(temp_html);
    });
}

// async function LoadBookmark() {
//     console.log("버튼누름")
//     const response = await fetch(`${backend_base_url}/diary/${diary_id}/bookmark/`, {
//         method: 'GET',
//     });

//     const DiaryList = document.getElementById('bookmark-box');
// }.then(res => res.json()).then(data => {
//     console.log(res)
//     $('#bookmark-box').empty()
//     data.forEach((a) => {
//         let title = a['title']
//         let img = a['article_img']
//         let nickname = a['nickname']
//         let temp_html = `<div class="col mb-5">
//                 <div class="card h-100">
//                     <img class="card-img-top" src="${img}" alt="..." />
//                         <!-- 포스팅 카드가 보여지는 곳-->
//                     <div class="card-body p-4">
//                         <div class="text-center">
//                             <!-- 게시글 title-->
//                             <h5 class="fw-bolder">${title}</h5>
//                             <!-- 게시글 작성자-->
//                             <hr>
//                                 <label for="" class="">${user}</label>
//                         </div>
//                     </div>
//                     <!-- 보러가기 버튼-->
//                     <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
//                         <div class="text-center"><a class="btn"
//                             href="${frontend_base_url}/diary_detail.html?id=${id}">보러가기</a></div>
//                     </div>
//                 </div>
//             </div>`
//         $('#bookmark-box').append(temp_html)

//     });

// })