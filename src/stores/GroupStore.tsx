import {create} from 'zustand';

type GroupState = {
    groupName : string,
    maxNum: number,
    groupId: string,
    inviteCode: string,

    setGroup: (groupName:string, maxNum:number) => void,
    setIdCode: (groupId:string, inviteCode:string) => void,
    join: (inviteCode:string, groupName:string, groupId:string) => void,
}

export const groupStore = create<GroupState>((set, get) => ({
    groupName : '',
    maxNum: 99999,
    groupId: '',
    inviteCode: '',

    setGroup: (groupName:string, maxNum:number) => {
        set({
            groupName,
            maxNum,
        })
    },
    setIdCode: (groupId:string, inviteCode:string) => {
        set({
            groupId,
            inviteCode,
        })
    },
    join: (inviteCode:string, groupName:string, groupId:string) => {
        set({
            inviteCode,
            groupId,
            groupName,
        })
    }
}))