import {
    BACK_BASE_URL,
    FRONT_BASE_URL,
    token,
    getProfile,
    loadProfile,
    UserDelete,
    loadingBookmark,
    ProfileNoUpdate,
    ProfileUpdate,
    LoadBookmark,
} from './api.js'
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const users_id = payload_parse.user_id;

window.onload = loadProfile()


// 수정버튼으로 수정폼으로 이동
function redirectUpdatePage() {
    window.location.href = `profile_update.html?id=${users_id}`;
}

function ProfileNoUpdate() {
    window.location.href = `profile.html?id=${users_id}`;
}
