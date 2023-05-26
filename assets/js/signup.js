import {
    handleSignup,
} from './user-api.js'

document.getElementById("signup-submit").onclick = function () {
    // 회원가입 요청
    handleSignup();
};
