window.onload = () => async function () {
    console.log("로딩됨");

    $('.hidden').hide();
    // $('.permission').hide();
    // $('.permission2').hide();
    // $('.withdrawal').hide();

    let urlParam = new URLSearchParams(window.location.search);
    let user_id = urlParam.get('user_id');
    console.log(user_id)

    const response = await getProfile(user_id);
    console.log(response)
}