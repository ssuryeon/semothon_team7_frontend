import { userStore } from "../stores/UserStore";
const BASE_URL='https://semothon-team7-backend.onrender.com';
const accessToken = userStore((state) => state.accessToken);

export async function getMyInfo() {
    console.log(`[getMyInfo start]`);
    const res = await (await fetch(`${BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })).json();

    console.log(res);
    return res.data;
}

export async function modifyMyInfo(nickname:string, target_sleep_time:string) {
    console.log(`[modifyInfo start] nickname: ${nickname}, target_sleep_time: ${target_sleep_time}`);
    const res = await (await fetch(`${BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            nickname,
            target_sleep_time,
        }),
    })).json();

    console.log(res);
    if(res.status == 'success') return true;
    else return false;
}

export async function alterGroup(group_id:string) {
    console.log(`[alterGroup start] group_id: ${group_id}`);
    const res = await (await fetch(`${BASE_URL}/api/users/group`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            group_id,
        }),
    })).json();

    console.log(res);
    if(res.status == 'success') return true;
    else return false;
}

export async function getAlarm(page:number) {
    console.log(`[getAlarm start] page: ${page}`);
    const res = await (await fetch(`${BASE_URL}/api/notifications?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })).json();

    console.log(res);
    if(res.status == 'success') return res.data;
    else return null;
}

export async function getReport(period:string) {
    console.log(`[getReport start] period: ${period}`);
    const res = await (await fetch(`${BASE_URL}/api/reports?period=${period}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })).json();

    console.log(res);
    if(res.status == 'success') return res.data;
    else return null;
}