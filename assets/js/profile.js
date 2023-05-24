console.log("마이페이지다마")
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const users_id = payload_parse.user_id
console.log(payload_parse.user_id)
console.log(users_id)

async function getProfile() {
    const response = await fetch(`http://127.0.0.1:8000/user/${users_id}`, {
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

    //내가 들어왔을 때,일단 팔로우팔로잉 표기해놨습니다 - 추후 수정예정
    if (me_id == profile.id) {
        $('.hidden').hide();
        $('.promission').show();
        $('.permission2').show();
        $('.withdrawal').show();
    } else {
        //다른유저가 마이프로필 방문(팔로우,팔로잉만 표기)
        $('.permission2').show();
    }

    // 이미지가 없거나 null 또는 오류일때 기본이미지는 저희 로고~
    if (profile.profile_img == '' || profile.profile_img == null || typeof profile.profile_img === 'undefined') {
        $('#img').attr('src', './assets/images/diary.png');
    } else {
        $('#img').attr('src', `${backend_base_url}${profile.profile_img}`);
    }

    //닉네임, 이메일, 내가 작성한 글, 내가 좋아요한 글, 북마크한 글, 팔로잉, 팔로워 표기
    $('#nickname').text(profile.nickname);
    $('#email').text(profile.email);
    $('#diary_count').text(profile.my_diary.length);
    $('#likes_count').text(profile.likes_diary.length);
    $('#bookmarked_diary_count').text(profile.bookmark_diary.length);
    $('#followings').text(profile.followings.length);
    $('#followers').text(profile.followers.length);
    $('#introduction').text(profile.introduction);

    // 팔로우 목록에 닉네임이 포함되어있는지 검사 (includes는 특정요소가 해당 배열안에있는지 확인)
    profile.followers.includes(nickname)
    const isAccountInArray = profile.followers.includes(nickname);

    if (isAccountInArray) {
        // 팔로우가 되어 있다면
        $('#follow-btn').hide(); // '팔로우하기'를 숨김.
        $('#following-btn').show(); // '팔로잉'을 보여줌.
    }
    else {
        // 팔로우가 되어 있지 않다면
        $('#follow-btn').show(); // '팔로우하기'를 보여줌.
        $('#following-btn').hide(); // '팔로잉'을 숨김.
    }

    // 팔로워 버튼 누를시 팔로우 , 본인은 팔로우 못함
    document.querySelector('#follow-btn').addEventListener('click', async function () {
        try {
            const response = await fetch(`http://127.0.0.1:8000/user/follow/${users_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access')
                }
            });

            if (response.ok) {
                alert('팔로우 되었습니다.');
                location.reload();
            } else {
                alert('본인은 팔로우할 수 없습니다ㅠ');
                location.reload();
            }
        } catch (error) {
            console.error('오류 발생:', error);
            location.reload();
        }




    });



}


// 회원탈퇴
async function UserDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`http://127.0.0.1:8000/user/`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status == 204) {
            alert("삭제 완료!")
            location.assign('login.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}

    //팔로우 요청하기 - 밑에는 전팀에서 썼던 ajax로 작성한 코드를 참고용으로 바꿔봤습니당

    // $('#follow-btn, #unfollow-btn').click(async function () {
    //     const response = await $.ajax({
    //         url: `http://127.0.0.1:8000/user/follow/${users_id}/`,
    //         method: 'POST',
    //         contentType: 'application/json',
    //         dataType: "json",
    //         headers: {
    //             Authorization: 'Bearer ' + localStorage.getItem("access"),

    //         },
    //         success: function (response) {
    //             alert(response);
    //             // 알람과 새로고침 없이 적용을 해보자.
    //             location.reload();
    //         },
    //         // 본인일 경우
    //         error: function (error) {
    //             alert('본인은 팔로우할 수 없습니다ㅠ', error);
    //             location.reload();
    //         }
    //     });
    // });