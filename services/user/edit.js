import axios from "axios";
import { CONTENT_SERVER_HOST } from "../constants";

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/user/info/",
});

export default instance;

export const userEmailEditInstance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/user/verify_email/",
});

export const userImageUploadInstance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/user/profile_pic/upload/",
});
