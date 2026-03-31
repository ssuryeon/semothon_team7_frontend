import {create} from 'zustand';

type UserState = {
    name: string
    email: string
    accessToken: string
    refreshToken: string
  
    signUp: (name: string, email: string, accessToken:string, refreshToken:string) => void
    login: (email: string, accessToken:string) => void
}

export const userStore = create<UserState>((set, get) => ({
    name: '',
    email: '',
    accessToken: '',
    refreshToken: '',

    signUp: (name:string, email:string, accessToken:string, refreshToken:string) => {
        set({
            name,
            email,
            accessToken,
            refreshToken,
        })
    },
    login: (email:string, accessToken:string) => {
        set({
            email,
            accessToken,
        })
    }
}))