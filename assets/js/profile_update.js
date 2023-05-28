
console.log("유저프로필 업데이트 js 작동")
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    BeforeProfile(urlParams);

}
