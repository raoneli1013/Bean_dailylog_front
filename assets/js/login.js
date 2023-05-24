import {
    handleLogin
} from './user-api.js'

document.getElementById("login-submit").onclick = function() {
    // 회원가입 요청
    handleLogin();
  };
