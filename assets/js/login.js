import { BACK_BASE_URL, handleLogin } from "./api.js";

document.getElementById("login-submit").onclick = function () {
  // 로그인 요청
  handleLogin();
};

document.getElementById("google-login").onclick = function () {
  // 구글로그인 요청
  window.location.href = `${BACK_BASE_URL}/google/login/`
};
