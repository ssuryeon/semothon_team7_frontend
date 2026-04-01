import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
    name: string
    email: string
    accessToken: string
    refreshToken: string

    signUp: (name: string, email: string, accessToken: string, refreshToken: string) => void
    login: (email: string, accessToken: string) => void
}

export const userStore = create<UserState>()(
    persist(
        (set, get) => ({
            name: '',
            email: '',
            accessToken: '',
            refreshToken: '',

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
        }),
        {
            name: 'user-storage',
        }
    )
);