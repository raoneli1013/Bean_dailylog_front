console.log("마이페이지다마")
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
console.log(payload_parse.user_id)

// $('.hidden').hide();
// $('.permission').hide();
// $('.permission2').hide();

async function getProfile() {
    const response = await fetch(`http://127.0.0.1:8000/user/${payload_parse.user_id}`, {
        headers: {
            "Authorization": "Bearer" + localStorage.getItem("access")
        },
        method: 'GET',
    })
    const data = await response.json();
    return data;
}


window.onload = async function loadProfile() {
    const profile = await getProfile();
    console.log(profile);

    const me_id = profile.id;
    const nickname = profile.nickname;

    //접속유저 == 프로필유저
    if (me_id == profile.id) {
        $('.hidden').hide();
        $('.promission').show();
        $('.permission2').show();
        $('.withdrawal').show();
    } else {
        //다른유저가 마이프로필 방문
        $('.hidden').hide();
        $('.promission').hide();
        $('.permission2').show();
    }

    if (profile.profile_img == '' || profile.profile_img == null || typeof profile.profile_img === 'undefined') {
        $('#img').attr('src', 'https://blog.kakaocdn.net/dn/0WCOh/btsftHK9GZz/zWlQWK1gtgPiD0zTWIefek/img.gif');
    } else {
        $('#img').attr('src', `${backend_base_url}${response.profile_img}`);
    }




}

// $(document).ready(async function () {
//     console.log("로딩됨");

//     $('.hidden').hide();
//     $('.permission').hide();
//     $('.permission2').hide();
//     $('.withdrawal').hide();

//     let urlParam = new URLSearchParams(window.location.search);
//     let user_id = urlParam.get('user_id');
//     console.log(urlParam)

//     const response = await getProfile(user_id);
//     console.log(response)

//     if (localStorage.getItem("payload")) {

//         const payload = localStorage.getItem("payload");
//         const payload_parse = JSON.parse(payload)

//         const token = localStorage.getItem("access");
//         const me_id = payload_parse.user_id;
//         console.log(me_id)
//         const email = payload_parse.email;

//         if (me_id == user_id) {
//             $('.permission').show();
//             console.log("내가 이 ")
//         } else {
//             // 다른 사용자 라면
//             $('.permission2').show();
//             $('#unfollow-btn').hide();

//             response.followers.includes(account)
//             const isAccountInArray = response.followers.includes(account);

//             if (isAccountInArray) {
//                 // 팔로우가 되어 있다면
//                 $('#follow-btn').hide(); // '팔로우하기'를 숨김.
//                 $('#following-btn').show(); // '팔로잉'을 보여줌.
//             }
//             else {
//                 // 팔로우가 되어 있지 않다면
//                 $('#follow-btn').show(); // '팔로우하기'를 보여줌.
//                 $('#following-btn').hide(); // '팔로잉'을 숨김.
//             }
//         }

//     }
// })