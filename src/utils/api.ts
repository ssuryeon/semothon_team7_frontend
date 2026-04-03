// src/utils/api.ts
import { userStore } from '../stores/UserStore';

const BASE_URL = "https://semothon-team7-backend.onrender.com"; 

export async function fetchHomeData() {
    const accessToken = userStore.getState().accessToken;
    console.log('fetchHomeData 호출됨');
    try {
        const res = await fetch(`${BASE_URL}/api/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log('응답 status:', res.status);
        const result = await res.json();
        console.log('응답 데이터:', result);
        return result;

    } catch (error) {
        console.error('fetch 실패:', error);
        return null;
    }
}