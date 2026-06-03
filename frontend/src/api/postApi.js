import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 추가
api.interceptors.request.use(config => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data) {
        console.log('Request Data:', config.data);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 응답 인터셉터 추가
api.interceptors.response.use(response => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    console.log('Response Data:', response.data);
    return response;
}, error => {
    console.error(`[API Error] ${error.response?.status} ${error.config?.url}`);
    console.error('Error Details:', error.response?.data || error.message);
    return Promise.reject(error);
});

export const postApi = {
    // 모든 게시글 조회
    getAllPosts: () => api.get('/posts'),
    
    // 특정 게시글 조회
    getPost: (id) => api.get(`/posts/${id}`),
    
    // 게시글 작성
    createPost: (postData) => api.post('/posts', postData),
    
    // 게시글 수정
    updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
    
    // 게시글 삭제
    deletePost: (id) => api.delete(`/posts/${id}`),
};

export default api;
