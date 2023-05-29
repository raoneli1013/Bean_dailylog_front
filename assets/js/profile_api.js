import{
    FRONT_BASE_URL
} from './api.js'
const FRONT_BASE_URL = 'http://127.0.0.1:5500'
// 수정버튼으로 수정폼으로 이동
function redirectUpdatePage() {
    window.location.href = `profile2_update.html`;

}

function ProfileNoUpdate() {
    window.location.href = `profile2.html`;
}

