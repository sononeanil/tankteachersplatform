import axios from "axios";

const aiClient = axios.create({
    baseURL: import.meta.env.VITE_AI_BASE_URL
});

export default aiClient;

