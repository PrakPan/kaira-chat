import axios from 'axios';

const instance = axios.create({
    baseURL: "https://apis.tarzanway.com/user/social_login/facebook/"
})

export default instance;