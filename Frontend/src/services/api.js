import axios from "axios";
import { URLS } from "./url";

export const mainApi = axios.create({
    baseURL: URLS.MAIN_URL,
});

export const authApi = axios.create({
    baseURL: URLS.AUTH_URL,
});