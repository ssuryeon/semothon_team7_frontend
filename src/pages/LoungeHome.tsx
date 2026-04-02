import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { userStore } from '../stores/UserStore';
import { getRemainingTimeText } from '../utils/timeUtils';
import { useSleepFeed } from '../hooks/useSleepFeed';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type SleepStatus = 'before_sleep' | 'sleeping' | 'delayed';
interface FeedMember {
  id: string;
  nickname: string;
  status: SleepStatus;
}

// ─────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────
const T = {
  // Glass card — light mode
  cardBg:     'rgba(255, 255, 255, 0.58)',
  cardBorder: 'rgba(255, 255, 255, 0.80)',
  cardBlur:   '16px',
  cardRadius: '18px',

  // Typography — light mode
  white:        '#FFFFFF',
  whiteAlpha70: 'rgba(255,255,255,0.70)',
  text:         '#1F2937',
  textMuted:    '#6B7280',
  label:        '#5E7BA1',

  // Status colors (mode-independent)
  delayed:     '#FF0000',
  beforeSleep: '#C9A227',
  sleeping:    '#9CA3AF',

  // Button
  btnBg:   '#FFF195',
  btnText: '#1F2937',

  // ── Dark (sleep) mode overrides ──
  dark: {
    cardBg:     'rgba(0, 0, 0, 0.42)',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
    text:       '#FFFFFF',
    textMuted:  'rgba(255, 255, 255, 0.55)',
    label:      'rgba(255, 255, 255, 0.55)',
    divider:    'rgba(255, 255, 255, 0.18)',
  },
} as const;

// ─────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const btnPress = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(0.97); }
`;

// ─────────────────────────────────────────────
// Layout root — background image fills everything
// ─────────────────────────────────────────────
const PageRoot = styled.div<{ $isSleepMode: boolean }>`
  position: relative;
  min-height: 100dvh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /*
   * $isSleepMode가 false → 라이트 배경
   * $isSleepMode가 true  → 다크(수면) 배경
   * background-image은 transition이 직접 적용되지 않으므로
   * opacity 페이드를 위해 ::before 오버레이 방식 사용
   */
  background-image: ${({ $isSleepMode }) =>
    $isSleepMode
      ? "url('/dark_background.png')"
      : "url('/light_background.png')"};
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  /* 배경 전환: JS로 src 교체 + opacity 페이드 */
  transition: opacity 0.6s ease-in-out;

  /* 상단 Safe Area까지 배경이 덮이도록 */
  padding-top: env(safe-area-inset-top, 0px);

  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  * { box-sizing: border-box; }
`;

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────
const Header = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /*
   * 상단 여백: PageRoot가 safe-area-inset-top 만큼 이미 밀려 있으므로
   * Header는 그 아래에서 자연스럽게 시작. 기존 52px → 16px로 줄여 이중 여백 방지.
   */
  padding: 16px 20px 12px;
`;

const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover  { background: rgba(255, 255, 255, 0.18); }
  &:active { background: rgba(255, 255, 255, 0.28); }
`;

/* Logo image — sized to fit the header comfortably */
const LogoImg = styled.img`
  height: 22px;
  width: auto;
  object-fit: contain;
  /* gentle drop-shadow so it reads on any background brightness */
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.20));
`;

// ─────────────────────────────────────────────
// Main scrollable content
// ─────────────────────────────────────────────
const Main = styled.main`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*
   * 하단 여백 계산:
   *   172px = 버튼(18px 패딩×2 + ~60px 높이) + 타운 이미지 높이 + 기본 여백
   *   env(safe-area-inset-bottom) = iOS Home Indicator 등 Safe Area 추가 확보
   * → 스크롤 시 마지막 피드 카드가 하단 UI에 절대 가려지지 않음
   */
  padding: 0 16px calc(172px + env(safe-area-inset-bottom, 0px));
  gap: 12px;
`;

// ─────────────────────────────────────────────
// Moon image section
// ─────────────────────────────────────────────
const MoonSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
  animation: ${fadeUp} 0.65s ease both;
`;

const MoonImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  /* subtle warm glow — mirrors the original SVG drop-shadow effect */
  filter:
    drop-shadow(0 8px 28px rgba(252, 229, 172, 0.38))
    drop-shadow(0 0 14px rgba(241, 198, 136, 0.22));
`;

const SleepCountText = styled.p`
  margin-top: 14px;
  color: ${T.white};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-align: center;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.22);
`;

const AchievementText = styled.p`
  margin-top: 4px;
  color: ${T.whiteAlpha70};
  font-size: 0.825rem;
  font-weight: 500;
`;

// ─────────────────────────────────────────────
// Shared glass card
// ─────────────────────────────────────────────
const GlassCard = styled.div<{ $isSleepMode: boolean }>`
  width: 100%;
  border-radius: ${T.cardRadius};
  background: ${({ $isSleepMode }) =>
    $isSleepMode ? T.dark.cardBg : T.cardBg};
  border: 1px solid ${({ $isSleepMode }) =>
    $isSleepMode ? T.dark.cardBorder : T.cardBorder};
  backdrop-filter: blur(${T.cardBlur});
  -webkit-backdrop-filter: blur(${T.cardBlur});
  box-shadow:
    0 4px 24px rgba(30, 50, 100, 0.12),
    inset 0 1px 0 ${({ $isSleepMode }) =>
      $isSleepMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.70)'};
  /* 카드 색상 부드럽게 전환 */
  transition: background 0.6s ease-in-out, border-color 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
`;

// ─────────────────────────────────────────────
// My Status card
// ─────────────────────────────────────────────
const StatusCard = styled(GlassCard)`
  display: flex;
  align-items: stretch;
  padding: 14px 16px;
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.08s;
`;

const StatusHalf = styled.div<{ $end?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${({ $end }) => ($end ? 'flex-end' : 'flex-start')};
`;

const CardLabel = styled.span<{ $isSleepMode: boolean }>`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $isSleepMode }) => ($isSleepMode ? T.dark.label : T.label)};
  letter-spacing: 0.02em;
  margin-bottom: 8px;
  transition: color 0.6s ease-in-out;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserName = styled.p<{ $isSleepMode: boolean }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ $isSleepMode }) => ($isSleepMode ? T.dark.text : T.text)};
  line-height: 1.3;
  margin: 0;
  transition: color 0.6s ease-in-out;
`;

const StatusDotLine = styled.p<{ $color: string }>`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  margin: 2px 0 0;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const VDivider = styled.div<{ $isSleepMode: boolean }>`
  width: 1px;
  align-self: stretch;
  margin: 0 14px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ $isSleepMode }) =>
      $isSleepMode ? T.dark.divider : 'rgba(94, 123, 161, 0.40)'} 20%,
    ${({ $isSleepMode }) =>
      $isSleepMode ? T.dark.divider : 'rgba(94, 123, 161, 0.40)'} 80%,
    transparent 100%
  );
  transition: background 0.6s ease-in-out;
`;

const TargetTime = styled.p<{ $isSleepMode: boolean }>`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ $isSleepMode }) => ($isSleepMode ? T.dark.text : T.text)};
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0;
  transition: color 0.6s ease-in-out;
`;

const RemainingHint = styled.p<{ $isSleepMode: boolean }>`
  font-size: 0.7rem;
  color: ${({ $isSleepMode }) => ($isSleepMode ? T.dark.textMuted : T.textMuted)};
  margin: 3px 0 0;
  font-weight: 500;
  transition: color 0.6s ease-in-out;
`;

// ─────────────────────────────────────────────
// Feed card
// ─────────────────────────────────────────────
const FeedCard = styled(GlassCard)`
  padding: 14px 16px;
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.16s;
`;

const FeedCardLabel = styled.p<{ $isSleepMode: boolean }>`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $isSleepMode }) => ($isSleepMode ? T.dark.label : T.label)};
  letter-spacing: 0.02em;
  margin: 0 0 12px;
  transition: color 0.6s ease-in-out;
`;

const FeedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FeedItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FeedInfo = styled.div`
  flex: 1; /* 남은 가로 공간 모두 차지 → 우측 아이콘이 끝에 붙도록 */
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FeedName = styled.span<{ $delayed: boolean; $isSleepMode: boolean }>`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ $delayed, $isSleepMode }) =>
    $delayed ? T.delayed : $isSleepMode ? T.dark.text : T.text};
  line-height: 1.3;
  transition: color 0.6s ease-in-out;
`;

const FeedStatusText = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  gap: 3px;
`;

/* ── 콕 찌르기(poke) 버튼 ── */
const PokeBtn = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.15s;

  &:hover  { background: rgba(0, 0, 0, 0.06); }
  &:active { background: rgba(0, 0, 0, 0.12); }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────

/**
 * 상태에 따른 프로필 이미지 매핑:
 *   sleeping               → /profile1.png  (자는 사람 — 수면 모드)
 *   before_sleep | delayed → /profile2.png  (안 자는 사람 — 기상/취침 전)
 */
const avatarSrc = (status: SleepStatus): string =>
  status === 'sleeping' ? '/profile1.png' : '/profile2.png';

const AvatarCircle = styled.div<{ $delayed: boolean; $isSleepMode: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;

  /*
   * 수면 모드($isSleepMode=true): 테두리 제거 + 회색 배경
   * 취침 지연($delayed=true)    : 빨간 테두리 + 반투명 빨간 배경
   * 기본                        : 회색 계열 테두리 + 반투명 파란-회색 배경
   */
  background: ${({ $isSleepMode, $delayed }) =>
    $isSleepMode
      ? 'rgba(120, 120, 120, 0.25)'          /* 수면 중 → 회색 */
      : $delayed
        ? 'rgba(255, 0, 0, 0.06)'            /* 지연 → 빨간 */
        : 'rgba(100, 120, 160, 0.18)'};      /* 기본 → 파란-회색 */

  border: ${({ $isSleepMode, $delayed }) =>
    $isSleepMode
      ? 'none'                               /* 수면 중 → 테두리 없음 */
      : $delayed
        ? `2px solid ${T.delayed}`           /* 지연 → 빨간 테두리 */
        : '2px solid rgba(160, 180, 210, 0.60)'}; /* 기본 → 회색 테두리 */

  transition: background 0.6s ease-in-out, border 0.6s ease-in-out;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 원형 영역을 꽉 채우도록 */
  display: block;
`;

/** status + isSleepMode prop을 받아 이미지·스타일을 자동 결정 */
const Avatar = ({
  status = 'before_sleep',
  isSleepMode = false,
}: {
  status?: SleepStatus;
  isSleepMode?: boolean;
}) => (
  <AvatarCircle $delayed={status === 'delayed'} $isSleepMode={isSleepMode}>
    <AvatarImg src={avatarSrc(status)} alt="프로필" />
  </AvatarCircle>
);

// ─────────────────────────────────────────────
// Status helper
// ─────────────────────────────────────────────
const statusMeta = (s: SleepStatus) => {
  if (s === 'delayed')  return { label: '취침 지연', color: T.delayed,     dot: T.delayed     };
  if (s === 'sleeping') return { label: '취침 중',   color: T.sleeping,    dot: T.sleeping    };
  /* before_sleep */    return { label: '취침 전',   color: T.beforeSleep, dot: T.beforeSleep };
};

// ─────────────────────────────────────────────
// Town silhouette — pinned to bottom, above button
// ─────────────────────────────────────────────
const TownImg = styled.img`
  /* Sits fixed at the very bottom of the screen */
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  /* height auto — preserves aspect ratio of the asset */
  height: auto;
  object-fit: cover;
  object-position: bottom center;
  /*
   * z-index 레이어 구조:
   *   FloatArea (버튼)  z-index: 30  ← 항상 최상단
   *   Main (카드/피드)  z-index: 10  ← 콘텐츠
   *   TownImg (건물)    z-index:  5  ← 배경 장식 — 콘텐츠 뒤, 배경 앞
   *
   * 기존 z-index: 20 → 5로 낮춰 실시간 피드가 건물에 가려지는 문제 해결
   */
  z-index: 5;
  pointer-events: none;
  /*
   * iOS Safe Area 대응: 타운 이미지가 Home Indicator에 가려지지 않도록
   * 하단에 safe-area-inset-bottom 만큼 패딩을 줌
   */
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

// ─────────────────────────────────────────────
// Floating sleep button
// ─────────────────────────────────────────────
const FloatArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  /* above town silhouette */
  z-index: 30;
  /*
   * iOS Safe Area 대응:
   *   - 기본 버튼 하단 여백 32px 에 safe-area-inset-bottom 을 추가
   *   - Home Indicator가 있는 기기에서도 버튼이 절대 가려지지 않음
   */
  padding: 0 16px calc(32px + env(safe-area-inset-bottom, 0px));

  /* Subtle gradient fade above the button */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    height: 36px;
    background: linear-gradient(to bottom, transparent, rgba(80, 110, 160, 0.18));
    pointer-events: none;
  }
`;

// 버튼 클릭 시 이미지 전체가 살짝 눌리는 느낌을 주는 wrapper
const SleepBtn = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent; /* CSS 디자인 없음 — 이미지가 버튼 자체 */
  cursor: pointer;
  /* 클릭 시 살짝 눌리는 느낌 */
  &:active {
    animation: ${btnPress} 0.15s ease;
  }
  /* 이미지 안에 기본 드래그 방지 */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function LoungeHome() {
  /* ── stores ── */
  // TODO: targetTime은 현재 로컬 상태로 임시 하드코딩.
  //       userStore 또는 sleepSettingStore에 targetTime이 추가되면 아래 줄을 제거하고
  //       const { name: userName, targetTime } = userStore(); 형태로 교체할 것.
  const { name: userName } = userStore();
  const [targetTime] = useState('12:30');

  /* ── 수면 모드 상태 ── */
  // false: 기상/라이트 모드, true: 수면/다크 모드
  const [isSleepMode, setIsSleepMode] = useState(false);

  /* ── hook ── */
  const { feedList, totalMembers, sleepingMembers } = useSleepFeed();

  /* ── computed ── */
  const remainingText = getRemainingTimeText(targetTime);
  const achieveRate   = totalMembers > 0
    ? Math.round((sleepingMembers / totalMembers) * 100)
    : 0;

  /* ── mock fallback (removed once API is live) ── */
  const feed: FeedMember[] = (feedList && feedList.length > 0)
    ? feedList as FeedMember[]
    : [
        { id: '1', nickname: '바나나킥',   status: 'sleeping'     },
        { id: '2', nickname: '허니버터칩', status: 'delayed'      },
        { id: '3', nickname: '오레오',     status: 'before_sleep' },
      ];

  const handleSleepStart = () => {
    // TODO: 수면 시작/종료 API 연동
    setIsSleepMode(prev => !prev);
    console.log(isSleepMode ? '기상!' : '수면 시작!');
  };

  return (
    <PageRoot $isSleepMode={isSleepMode}>

      {/* ── Header ── */}
      <Header>
        {/* 수면 모드: settings.png → settings2.png */}
        <IconBtn aria-label="설정 열기">
          <img
            src={isSleepMode ? '/settings2.png' : '/settings.png'}
            alt="설정"
            style={{ width: '24px', height: '24px' }}
          />
        </IconBtn>

        {/* 수면 모드: logo_black.png → logo_white.png */}
        <LogoImg
          src={isSleepMode ? '/logo_white.png' : '/logo_black.png'}
          alt="SleepMate"
        />

        {/* 수면 모드: menu.png → menu2.png */}
        <IconBtn aria-label="메뉴 열기">
          <img
            src={isSleepMode ? '/menu2.png' : '/menu.png'}
            alt="메뉴"
            style={{ width: '24px', height: '24px' }}
          />
        </IconBtn>
      </Header>

      {/* ── Body ── */}
      <Main>

        {/* ✦ Moon */}
        <MoonSection aria-label="수면 현황">
          <MoonImg src="/moon.png" alt="달" />
          <SleepCountText>
            {totalMembers}명 중 {sleepingMembers}명 취침 중
          </SleepCountText>
          <AchievementText>달성률 {achieveRate}%</AchievementText>
        </MoonSection>

        {/* ── My Status Card ── */}
        <StatusCard as="section" aria-label="내 상태" $isSleepMode={isSleepMode}>
          <StatusHalf>
            <CardLabel $isSleepMode={isSleepMode}>현재 내 상태</CardLabel>
            <AvatarRow>
              {/*
               * isSleepMode=true (수면 시작):
               *   - 이미지: /profile1.png (자는 사람)
               *   - 테두리: 제거, 배경: 회색
               * isSleepMode=false (기상/취침 전):
               *   - 이미지: /profile2.png (안 자는 사람)
               *   - 테두리: 회색 유지
               */}
              <Avatar
                status={isSleepMode ? 'sleeping' : 'before_sleep'}
                isSleepMode={isSleepMode}
              />
              <div>
                <UserName $isSleepMode={isSleepMode}>{userName || '콘칲'}</UserName>
                {/* 수면 시작 시: '취침 전' → '취침 중', 도트 색상 회색으로 전환 */}
                <StatusDotLine $color={isSleepMode ? T.sleeping : T.beforeSleep}>
                  <span>●</span> {isSleepMode ? '취침 중' : '취침 전'}
                </StatusDotLine>
              </div>
            </AvatarRow>
          </StatusHalf>

          <VDivider $isSleepMode={isSleepMode} />

          <StatusHalf $end>
            <CardLabel $isSleepMode={isSleepMode}>취침 목표 시간</CardLabel>
            <TargetTime $isSleepMode={isSleepMode}>오전 {targetTime}</TargetTime>
            <RemainingHint $isSleepMode={isSleepMode}>{remainingText}</RemainingHint>
          </StatusHalf>
        </StatusCard>

        {/* ── Real-time Feed Card ── */}
        <FeedCard as="section" aria-label="실시간 피드" $isSleepMode={isSleepMode}>
          <FeedCardLabel $isSleepMode={isSleepMode}>실시간 피드</FeedCardLabel>

          <FeedList>
            {feed.map((m, i) => {
              const meta = statusMeta(m.status);
              return (
                <FeedItem key={m.id ?? i}>
                  <Avatar status={m.status} />
                  <FeedInfo>
                    <FeedName $delayed={m.status === 'delayed'} $isSleepMode={isSleepMode}>
                      {m.nickname}
                    </FeedName>
                    <FeedStatusText $color={meta.color}>
                      <span style={{ color: meta.dot }}>●</span>
                      {meta.label}
                    </FeedStatusText>
                  </FeedInfo>

                  {/* 콕 찌르기 버튼 — 클릭 이벤트는 담당 파트에서 연결 */}
                  <PokeBtn aria-label={`${m.nickname}님 콕 찌르기`} type="button">
                    <img src="/hand.png" alt="콕 찌르기" />
                  </PokeBtn>
                </FeedItem>
              );
            })}
          </FeedList>
        </FeedCard>

      </Main>

      {/* ✦ Town silhouette */}
      <TownImg src="/town.png" alt="" aria-hidden="true" />

      {/* ── Floating Sleep/Wake Button ── */}
      <FloatArea>
        <SleepBtn
          onClick={handleSleepStart}
          aria-label={isSleepMode ? '기상하기' : '수면 시작'}
        >
          {/*
           * 수면 모드 여부에 따라 버튼 이미지를 교체
           *   false → /sleep_btn.png  (노란 수면 시작 버튼)
           *   true  → /wake_btn.png   (다크 기상하기 버튼)
           */}
          <img
            src={isSleepMode ? '/wake_btn.png' : '/sleep_btn.png'}
            alt={isSleepMode ? '기상하기' : '수면 시작'}
            style={{ width: '100%', height: 'auto' }}
          />
        </SleepBtn>
      </FloatArea>

    </PageRoot>
  );
}
