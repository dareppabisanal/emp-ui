import api from "./api.jsx";

export const postRequest = async (payload, url) => {
    const response = await api.post(url, payload);
    return response.data;
};

export const getRequest = async (payload, url) => {
    const response = await api.get(url, payload);
    return response.data;
};