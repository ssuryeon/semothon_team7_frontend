// src/components/MoonPhase.tsx
import styled from 'styled-components';

interface MoonPhaseProps {
  sleepingCount: number;
  totalCount: number;
}

// 기존 LoungeHome에 있던 MoonImg 스타일을 가져와서 부드러운 전환 효과(transition)를 추가했습니다.
const MoonImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 8px 28px rgba(252, 229, 172, 0.38))
          drop-shadow(0 0 14px rgba(241, 198, 136, 0.22));
  transition: all 0.6s ease-in-out; /* 달 모양이 바뀔 때 부드럽게 전환 */
`;

export default function MoonPhase({ sleepingCount, totalCount }: MoonPhaseProps) {
  // 1. 달성률(비율) 계산 (0 ~ 1 사이의 값)
  // 방어 로직: 그룹 인원이 0명일 경우 0으로 처리
  const ratio = totalCount === 0 ? 0 : sleepingCount / totalCount;

  // 2. 비율에 따른 달 이미지 결정
  let currentMoonImg = '/moon0.png';

  if (ratio === 0) {
    currentMoonImg = '/moon0.png';         // 0% 달성 (아무도 안 잠)
  } else if (ratio > 0 && ratio < 0.5) {
    currentMoonImg = '/moon1.png';         // 1% ~ 49% 달성
  } else if (ratio >= 0.5 && ratio < 1) {
    currentMoonImg = '/moon2.png';         // 50% ~ 99% 달성
  } else if (ratio === 1) {
    currentMoonImg = '/moon3.png';         // 100% 달성 (모두 취침)
  }

  return (
    <MoonImg 
      src={currentMoonImg} 
      alt={`현재 달 모양 (달성률 ${Math.round(ratio * 100)}%)`} 
    />
  );
}