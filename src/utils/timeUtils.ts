/**
 * 목표 시간(targetTime: "HH:MM")과 현재 시간의 차이를 계산하여 
 * 사용자 친화적인 문구로 반환하는 로직
 */
export function getRemainingTimeText(targetTime: string | null): string {
  if (!targetTime) return "목표 시간을 설정해 주세요";

  const now = new Date();
  const [tHour, tMin] = targetTime.split(':').map(Number);
  
  // 오늘 날짜의 목표 시간 설정
  const targetDate = new Date();
  targetDate.setHours(tHour, tMin, 0, 0);

  let diffMs = targetDate.getTime() - now.getTime();
  
  // 💡 자정 보정 로직 (예: 현재 23:30, 목표 00:30인 경우)
  if (diffMs < -12 * 60 * 60 * 1000) {
    diffMs += 24 * 60 * 60 * 1000;
  } 
  else if (diffMs > 12 * 60 * 60 * 1000) {
    diffMs -= 24 * 60 * 60 * 1000;
  }

  const diffMin = Math.round(diffMs / (1000 * 60));

  const formatDuration = (absMin: number): string => {
    if (absMin < 60) return `${absMin}분`;
    const hours = Math.floor(absMin / 60);
    const mins = absMin % 60;
    return mins === 0 ? `${hours}시간` : `${hours}시간 ${mins}분`;
  };

  if (diffMin > 0) {
    return `목표까지 ${formatDuration(diffMin)} 전`;
  } else if (diffMin < 0) {
    return `목표 시간 ${formatDuration(Math.abs(diffMin))} 경과`;
  } else {
    return "지금이 바로 목표 시간입니다!";
  }
}
