// src/hooks/useSleepFeed.ts
export const useSleepFeed = () => {
  return {
    feedList: [
      { id: '1', nickname: '바나나킥', status: 'sleeping' },
      { id: '2', nickname: '허니버터칩', status: 'delayed' },
      { id: '3', nickname: '오레오', status: 'before_sleep' },
    ],
    totalMembers: 10,
    sleepingMembers: 5,
  };
};