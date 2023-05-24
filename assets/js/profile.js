$(document).ready(async function () {
    console.log("로딩됨");

    $('.hidden').hide();
    $('.permission').hide();
    $('.permission2').hide();
    $('.withdrawal').hide();

    let urlParam = new URLSearchParams(window.location.search);
    let user_id = urlParam.get('user_id');
    console.log(user_id)

    const response = await getProfile(user_id);
    console.log(response)

    if (localStorage.getItem("payload")) {

        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)

        const token = localStorage.getItem("access");
        const me_id = payload_parse.user_id;
        console.log(me_id)
        const email = payload_parse.email;

        if (me_id == user_id) {
            $('.permission').show();
            console.log("내가 이 ")
        } else {
            // 다른 사용자 라면
            $('.permission2').show();
            $('#unfollow-btn').hide();

            response.followers.includes(account)
            const isAccountInArray = response.followers.includes(account);

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
        }

    }
})