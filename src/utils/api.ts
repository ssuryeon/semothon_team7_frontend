// src/utils/api.ts
import { userStore } from '../stores/UserStore';

const BASE_URL = "https://semothon-team7-backend.onrender.com";

// ─────────────────────────────────────────────
// TODO: 백엔드 구현 필요
//   POST /api/poke  body: { targetUserId: string }
//   GET  /api/poke/notification  → { data: { fromNickname: string } | null }
//     (미확인 찌르기가 있으면 fromNickname 반환 후 서버에서 소비(consume) 처리)
// ─────────────────────────────────────────────

export async function sendPoke(targetUserId: string): Promise<boolean> {
    const accessToken = userStore.getState().accessToken;
    try {
        const res = await fetch(`${BASE_URL}/api/poke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ targetUserId }),
        });
        if (!res.ok) {
            console.warn('sendPoke 실패:', res.status);
        }
        return res.ok;
    } catch (error) {
        console.error('sendPoke 오류:', error);
        return false;
    }
}

export async function fetchPokeNotification(): Promise<{ fromNickname: string } | null> {
    const accessToken = userStore.getState().accessToken;
    try {
        const res = await fetch(`${BASE_URL}/api/poke/notification`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) return null;
        const result = await res.json();
        const data = result?.data ?? result;
        if (data?.fromNickname) return { fromNickname: data.fromNickname };
        return null;
    } catch (error) {
        console.error('fetchPokeNotification 오류:', error);
        return null;
    }
}

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
        if (!res.ok) {
            console.warn('fetchHomeData 인증 실패 또는 오류:', res.status);
            return null;
        }
        const result = await res.json();
        console.log('응답 데이터:', result);
        return result;

    } catch (error) {
        console.error('fetch 실패:', error);
        return null;
    }
}

export async function startSleep(goodnight_message: string = '') {
    const accessToken = userStore.getState().accessToken;
    try {
        const res = await fetch(`${BASE_URL}/api/sleep/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ goodnight_message }),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('startSleep 실패:', error);
        return null;
    }
}

export async function stopSleep(session_id: string) {
    const accessToken = userStore.getState().accessToken;
    try {
        const res = await fetch(`${BASE_URL}/api/sleep/stop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ session_id }),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('stopSleep 실패:', error);
        return null;
    }
}

export async function fetchFeedData() {
    const accessToken = userStore.getState().accessToken;
    console.log('fetchFeedData 호출됨');
    try {
        const res = await fetch(`${BASE_URL}/api/feed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log('feed 응답 status:', res.status);
        if (!res.ok) {
            console.warn('fetchFeedData 인증 실패 또는 오류:', res.status);
            return null;
        }
        const result = await res.json();
        console.log('feed 응답 데이터:', result);
        return result;

    } catch (error) {
        console.error('fetchFeedData 실패:', error);
        return null;
    }
}