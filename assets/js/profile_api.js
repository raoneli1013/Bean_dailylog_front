import {
    BACK_BASE_URL,
    FRONT_BASE_URL,
    token,
    ProfileNoUpdate,
    ProfileUpdate,
    LoadBookmark,
} from './api.js'

// 수정버튼으로 수정폼으로 이동
function redirectUpdatePage() {
    window.location.href = `profile_update.html?id=${users_id}`;
}

function ProfileNoUpdate() {
    window.location.href = `profile.html?id=${users_id}`;
}
