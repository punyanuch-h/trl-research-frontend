import { BACKEND_HOST } from "../constant/constants";
import axios from "axios";

const client = axios.create({
    baseURL: `${BACKEND_HOST}`,
});

export default client;