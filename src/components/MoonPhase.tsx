// src/components/MoonPhase.tsx

import React from 'react';

interface MoonPhaseProps {
  sleepingCount: number;
  totalCount: number;
}

/**
 * ratio 0.0 → 왼쪽 절반만 밝은 반달
 * ratio 1.0 → 완전한 보름달
 *
 * SVG clipPath + ellipse를 이용해 밝은 영역을 ratio에 따라 조절.
 * cx를 ratio에 따라 이동시켜 어두운 타원이 오른쪽으로 밀려나면서 밝은 영역이 확장됨.
 */
const MoonPhase: React.FC<MoonPhaseProps> = ({ sleepingCount, totalCount }) => {
  const ratio = totalCount > 0 ? Math.min(1, Math.max(0, sleepingCount / totalCount)) : 0;

  const cx = 90;
  const cy = 90;
  const r = 78;

  // 어두운 타원의 x 중심을 ratio에 따라 이동
  // ratio 0.0 → darkEllipse cx = 90 (달 중앙, 정확히 오른쪽 절반을 가림)
  // ratio 1.0 → darkEllipse cx = 90 + r*2 = 246 (달 바깥으로 완전히 밀려남 → 보름달)
  const darkEllipseCx = cx + r * 2 * ratio;

  return (
    <svg
      width={180}
      height={180}
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`수면 달: ${sleepingCount}/${totalCount}`}
    >
      <defs>
        {/* 달 원형 클립 */}
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* 어두운 배경 (전체 달) */}
      <circle cx={cx} cy={cy} r={r} fill="#1a2744" />

      {/* 밝은 영역: 달 전체를 밝게 칠하고, 그 위에 어두운 타원으로 덮어 가림 */}
      <g clipPath="url(#moonClip)">
        {/* 전체 밝은 달 */}
        <rect x={0} y={0} width={180} height={180} fill="#E8D5A3" />

        {/* 어두운 타원으로 오른쪽 영역 덮기 */}
        <ellipse
          cx={darkEllipseCx}
          cy={cy}
          rx={r}
          ry={r}
          fill="#1a2744"
        />
      </g>

      {/* 크레이터 (달 표면 무늬) - 밝은 부분에만 보이도록 */}
      <g clipPath="url(#moonClip)" opacity={0.35}>
        {/* 크레이터 1 */}
        <circle cx={70} cy={65} r={8} fill="#C4B080" />
        <circle cx={70} cy={65} r={6} fill="#D4C090" />

        {/* 크레이터 2 */}
        <circle cx={100} cy={110} r={11} fill="#C4B080" />
        <circle cx={100} cy={110} r={8} fill="#D4C090" />

        {/* 크레이터 3 */}
        <circle cx={58} cy={105} r={6} fill="#C4B080" />
        <circle cx={58} cy={105} r={4} fill="#D4C090" />

        {/* 크레이터 4 (작은 것) */}
        <circle cx={115} cy={72} r={5} fill="#C4B080" />
        <circle cx={115} cy={72} r={3.5} fill="#D4C090" />
      </g>

      {/* 달 테두리 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(232,213,163,0.25)" strokeWidth={1.5} />
    </svg>
  );
};

export default MoonPhase;
