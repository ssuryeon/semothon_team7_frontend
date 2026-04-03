import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AlarmState = {
    push_alarm: boolean,
    movement_alarm: boolean,

    setPush: () => void,
    setMovement: () => void,
}

export const alarmStore = create<AlarmState>()(
    persist(
        (set) => ({
            push_alarm: false,
            movement_alarm: false,

            setPush: () => {
                set((state) => ({
                    push_alarm: !state.push_alarm,
                }));
            },
            setMovement: () => {
                set((state) => ({
                    movement_alarm: !state.movement_alarm,
                }));
            }
        }),
        {
            name: 'alarm-storage',
        }
    )
);