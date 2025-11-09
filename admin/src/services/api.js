import axios from 'axios';

const apiNonce = window.gamifyApiSettings?.nonce || '';

const apiClient = axios.create({
    baseURL: '/wp-json/gamify/v1',
    headers: {
        'X-WP-Nonce': apiNonce,
    },
});

// --- Point Types API ---
export const getPointTypes = () => {
    return apiClient.get('/point-types');
};

export const createPointType = (data) => {
    return apiClient.post('/point-types', data);
};
