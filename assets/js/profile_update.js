import{
    BeforeProfile,
    ProfileUpdate,
} from './api.js'

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    BeforeProfile(urlParams);

}

