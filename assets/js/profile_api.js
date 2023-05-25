

console.log("프로필 api")

// 수정버튼으로 수정폼으로 이동
function redirectUpdatePage() {
    window.location.href = `profile_update.html?id=${users_id}`;

}


// const urlParams = new URLSearchParams(window.location.search).get('id');
// BeforeProfile(urlParams);


//원래 반영되어있던 내용을 가져와서 보여줌
async function BeforeProfile(user_id) {

    const response = await fetch(`http://127.0.0.1:8000/user/${users_id}/`, {
        method: 'GET',
    });

    response_json = await response.json();
    console.log(response_json)

    //원래 반영되어있던 닉네임과 내소개를 가져와서 보여줌
    // document.getElementById('nickname').value = response_json.nickname;
    // document.getElementById('introduction').value = response_json.introduction;

    $('#nickname').text(response_json.nickname);
    $('#email').text(response_json.email);
    $('#diary_count').text(response_json.my_diary.length);
    $('#likes_count').text(response_json.likes_diary.length);
    $('#bookmarked_diary_count').text(response_json.bookmark_diary.length);
    $('#followings').text(response_json.followings.length);
    $('#followers').text(response_json.followers.length);
    $('#introduction').text(response_json.introduction);

}


console.log("찍힌다")
//프로필 수정
async function ProfileUpdate() {
    const nickname = document.getElementById('nickname').value;
    const introduction = document.getElementById('introduction').value;
    const img = document.getElementById('profile_img').files[0]
    const token = localStorage.getItem("access");
    console.log(img)


    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("introduction", introduction);
    formData.append("profile_img", img);

    const response = await fetch(`http://127.0.0.1:8000/user/`, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + token,
        },
        body: formData,
    });


    if (response.status == 200) {
        alert("프로필 수정 완료")
        window.location.href = "profile.html?id=" + users_id;
    } else if (nickname == '' || introduction == '') {
        alert("빈칸을 입력해 주세요.")
    } else {
        console.error("요청 실패:", response);
    }

    //이미지가 안보내져서 아래 form태그로 다시
    // const response = await fetch(`http://127.0.0.1:8000/user/`, {
    //     headers: {
    //         "Authorization": "Bearer " + token,
    //         'content-type': 'application/json',
    //     },
    //     method: 'PUT',
    //     body: JSON.stringify({
    //         "nickname": nickname,
    //         "introduction": introduction,
    //         "profile_img": img
    //     })
    // })

}

