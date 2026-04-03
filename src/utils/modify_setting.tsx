const BASE_URL='https://semothon-team7-backend.onrender.com';

export async function getMyInfo(accessToken:string) {
    console.log(`[getMyInfo start]`);
    const res = await (await fetch(`${BASE_URL}/api/users/me`, {
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

export async function modifyMyInfo(nickname:string, target_sleep_time:string, accessToken:string) {
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

export async function getAlarm(page:number, accessToken:string) {
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