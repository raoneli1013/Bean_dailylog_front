import {
    BACK_BASE_URL,
    FRONT_BASE_URL,
    token,
    BeforeProfile
} from './api.js'

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    BeforeProfile(urlParams);
}
