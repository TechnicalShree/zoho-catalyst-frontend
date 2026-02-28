import axios from "axios";

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        "https://catalyst-hackathon-915650487.development.catalystserverless.com",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default api;
