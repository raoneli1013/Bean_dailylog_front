// const backend_base_url = "http://127.0.0.1:8000"
const backend_base_url = "https://lucedude.link"
const frontend_base_url = "http://127.0.0.1:5500"
// import { LikeLike, ClickLike } from './diary_api';
// 유저프로필에서 북마크 가져오는 js
// 추후 게시글이 추가되면 상세내용은 바꿀 예정입니다

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const users_id = payload_parse.user_id
console.log(users_id)

window.onload = fetch(`${backend_base_url}/diary/${diary_id}/bookmark/`, {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    }


},

).then(res => res.json()).then(data => {
    console.log(res)
    $('#bookmark-box').empty()
    data.forEach((a) => {
        let title = a['title']
        let img = a['article_img']
        let nickname = a['nickname']
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
                        <div class="text-center"><a class="btn"
                            href="${frontend_base_url}/diary_detail.html?id=${id}">보러가기</a></div>
                    </div>
                </div>
            </div>`
        $('#bookmark-box').append(temp_html)

    });

})