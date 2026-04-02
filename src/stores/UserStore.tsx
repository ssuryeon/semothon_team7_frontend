import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
    name: string
    email: string
    accessToken: string
    refreshToken: string
    target_sleep_time: string

    signUp: (name: string, email: string, accessToken: string, refreshToken: string) => void
    login: (email: string, accessToken: string) => void,
    setName: (name: string) => void,
    setTime: (target_sleep_time:string) => void
}

export const userStore = create<UserState>()(
    persist(
        (set, get) => ({
            name: '',
            email: '',
            accessToken: '',
            refreshToken: '',
            target_sleep_time: '',

            signUp: (name, email, accessToken, refreshToken) => {
                set({
                    name,
                    email,
                    accessToken,
                    refreshToken,
                })
            },

            login: (email, accessToken) => {
                set({
                    email,
                    accessToken,
                })
            },

            setName: (name:string) => {
                set({
                    name,
                })
            },

            setTime: (target_sleep_time:string) => {
                set({
                    target_sleep_time,
                })
            }
        }),
        {
            name: 'user-storage',
        }
    )
);