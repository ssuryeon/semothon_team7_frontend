import { groupStore } from "../stores/GroupStore";
const BASE_URL='https://semothon-team7-backend.onrender.com';

export async function setSleepTime(target_sleep_time:string, accessToken:string) {
    console.log(`[setTime start] time : ${target_sleep_time}`);
    const res = await (await fetch(`${BASE_URL}/api/users/target-time`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            target_sleep_time,
        })
    })).json()
    console.log(res);
    if(res.status == 'success') {
        return true;
    }
    else return false;
}

export async function createGroup(group_name:string, accessToken:string) {
    console.log(`[createGroup start] group_name : ${group_name}`)
    const res = await (await fetch(`${BASE_URL}/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            group_name,
        })
    })).json()
    console.log(res);

    if(res.status == 'success') {
        const id = res.data.group_id;
        const code = res.data.invite_code;
        return {id, code};
    }
    else return null;
}

export async function joinGroup(invite_code:string, accessToken:string) {
    console.log(`[joinGroup start] invite_code : ${invite_code}`);
    const res = await (await fetch(`${BASE_URL}/api/groups/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            invite_code,
        })
    })).json()
    console.log(res);

    if(res.status == 'success') {
        const id = res.data.group_id;
        const name = res.data.group_name;
        return {id, name}
    }
    else return null;
}