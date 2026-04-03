// src/pages/LoungeHome.tsx

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { userStore } from '../stores/UserStore';
import { getRemainingTimeText } from '../utils/timeUtils';
import { fetchHomeData } from '../utils/api';
import { useNavigate } from 'react-router';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type SleepStatus = 'before_sleep' | 'sleeping' | 'sleep' | 'SLEEPING' | 'delayed';
interface FeedMember {
  id: string;
  nickname: string;
  status: SleepStatus;
}

// interface HomeData {
//   targetTime: string;
// }

// ─────────────────────────────────────────────
// 시간 변환 유틸
// ─────────────────────────────────────────────
function formatKoreanTime(hhmm: string | null): string {
  if (!hhmm) return '시간 미설정';

  const [hourStr, minute] = hhmm.split(':');
  const hour = parseInt(hourStr, 10);

  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${hour12}:${minute}`;
}

// ─────────────────────────────────────────────
// ... (기존 T, Animations, Styled Components 전부 동일)
// ─────────────────────────────────────────────
const T = {
  cardBg:     'rgba(255, 255, 255, 0.58)',
  cardBorder: 'rgba(255, 255, 255, 0.80)',
  cardBlur:   '16px',
  cardRadius: '18px',
  white:        '#FFFFFF',
  whiteAlpha70: 'rgba(255,255,255,0.70)',
  text:         '#1F2937',
  textMuted:    '#6B7280',
  label:        '#5E7BA1',
  delayed:     '#FF0000',
  beforeSleep: '#C9A227',
  sleeping:    '#9CA3AF',
  btnBg:   '#FFF195',
  btnText: '#1F2937',
  dark: {
    cardBg:     'rgba(0, 0, 0, 0.42)',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
    text:       '#FFFFFF',
    textMuted:  'rgba(255, 255, 255, 0.55)',
    label:      'rgba(255, 255, 255, 0.55)',
    divider:    'rgba(255, 255, 255, 0.18)',
  },
} as const;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const btnPress = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(0.97); }
`;

const PageRoot = styled.div<{ $isSleepMode: boolean }>`
  position: relative;
  min-height: 100dvh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  background-image: ${({ $isSleepMode }) =>
    $isSleepMode
      ? "url('/dark_background.png')"
      : "url('/light_background.png')"};
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  transition: opacity 0.6s ease-in-out;
  padding-top: env(safe-area-inset-top, 0px);
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  * { box-sizing: border-box; }
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const LogoImg = styled.img`
  height: 22px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.20));
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px calc(172px + env(safe-area-inset-bottom, 0px));
  gap: 12px;
`;

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
  transition: background 0.6s ease-in-out, border-color 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
`;

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
  flex: 1;
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
  img { width: 100%; height: 100%; object-fit: contain; }
`;

const avatarSrc = (status: SleepStatus): string =>
  status === 'sleeping' ? '/profile1.png' : '/profile2.png';

const AvatarCircle = styled.div<{ $delayed: boolean; $isSleepMode: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background: ${({ $isSleepMode, $delayed }) =>
    $isSleepMode
      ? 'rgba(120, 120, 120, 0.25)'
      : $delayed
        ? 'rgba(255, 0, 0, 0.06)'
        : 'rgba(100, 120, 160, 0.18)'};
  border: ${({ $isSleepMode, $delayed }) =>
    $isSleepMode
      ? 'none'
      : $delayed
        ? `2px solid ${T.delayed}`
        : '2px solid rgba(160, 180, 210, 0.60)'};
  transition: background 0.6s ease-in-out, border 0.6s ease-in-out;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

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

const statusMeta = (s: SleepStatus) => {
  if (s === 'delayed')  return { label: '취침 지연', color: T.delayed,     dot: T.delayed     };
  if (s === 'sleeping') return { label: '취침 중',   color: T.sleeping,    dot: T.sleeping    };
                        return { label: '취침 전',   color: T.beforeSleep, dot: T.beforeSleep };
};

const TownImg = styled.img`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: auto;
  object-fit: cover;
  object-position: bottom center;
  z-index: 5;
  pointer-events: none;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const FloatArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  z-index: 30;
  padding: 0 16px calc(32px + env(safe-area-inset-bottom, 0px));
  &::before {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 100%;
    height: 36px;
    background: linear-gradient(to bottom, transparent, rgba(80, 110, 160, 0.18));
    pointer-events: none;
  }
`;

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 40;
`;

const MenuPanel = styled.div<{ $isOpen: boolean; $isSleepMode: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 75%;
  max-width: 320px;
  z-index: 50;
  background: ${({ $isSleepMode }) => ($isSleepMode ? '#1A1A2E' : 'white')};
  display: flex;
  flex-direction: column;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease, background 0.6s ease;
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 20px 16px;
`;

const MenuTitle = styled.h2<{ $isSleepMode: boolean }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  margin: 0;
  transition: color 0.6s ease;
`;

const MenuCloseBtn = styled.button<{ $isSleepMode: boolean }>`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${({ $isSleepMode }) => ($isSleepMode ? 'rgba(255,255,255,0.6)' : '#6B7280')};
  padding: 4px;
  transition: color 0.6s ease;
`;

const MenuDivider = styled.hr<{ $isSleepMode: boolean }>`
  border: none;
  border-top: 1px solid ${({ $isSleepMode }) =>
    $isSleepMode ? 'rgba(255,255,255,0.12)' : '#F3F4F6'};
  margin: 0;
  transition: border-color 0.6s ease;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const MenuItem = styled.button<{ $isSleepMode: boolean }>`
  background: none;
  border: none;
  text-align: left;
  font-size: 0.95rem;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  padding: 18px 0;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.6s ease;
  &:hover {
    background: ${({ $isSleepMode }) =>
      $isSleepMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
  }
`;

const SettingsOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 40;
`;

const SettingsPanel = styled.div<{ $isOpen: boolean; $isSleepMode: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 75%;
  max-width: 320px;
  z-index: 50;
  background: ${({ $isSleepMode }) => ($isSleepMode ? '#1A1A2E' : 'white')};
  display: flex;
  flex-direction: column;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease, background 0.6s ease;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 20px 16px;
`;

const SettingsTitle = styled.h2<{ $isSleepMode: boolean }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  margin: 0;
  transition: color 0.6s ease;
`;

const SettingsCloseBtn = styled.button<{ $isSleepMode: boolean }>`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${({ $isSleepMode }) => ($isSleepMode ? 'rgba(255,255,255,0.6)' : '#6B7280')};
  padding: 4px;
  transition: color 0.6s ease;
`;

const SettingsProfile = styled.div`
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SettingsAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
`;

const SettingsName = styled.p<{ $isSleepMode: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  margin: 0;
  transition: color 0.6s ease;
`;

const SettingsSubText = styled.p<{ $isSleepMode: boolean }>`
  font-size: 0.8rem;
  color: ${({ $isSleepMode }) => ($isSleepMode ? 'rgba(255,255,255,0.55)' : '#9CA3AF')};
  margin: 0;
  transition: color 0.6s ease;
`;

const SettingsDivider = styled.div<{ $isSleepMode: boolean }>`
  height: 1px;
  background: ${({ $isSleepMode }) =>
    $isSleepMode ? 'rgba(255,255,255,0.12)' : '#F3F4F6'};
  margin: 0 20px;
  transition: background 0.6s ease;
`;

const SettingsMenuList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
`;

const SettingsMenuItem = styled.li<{ $isSleepMode: boolean }>`
  padding: 16px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  cursor: pointer;
  transition: color 0.6s ease;
  &:hover {
    background: ${({ $isSleepMode }) =>
      $isSleepMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
  }
`;

const SleepBtnStyled = styled.button<{ $isSleepMode: boolean }>`
  display: block;
  width: 100%;
  padding: 18px 0;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  transition: background 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* 수면 시작: 노란 배경 / 기상: 어두운 배경 */
  background: ${({ $isSleepMode }) => ($isSleepMode ? '#2D3250' : '#FFF195')};
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  box-shadow: ${({ $isSleepMode }) =>
    $isSleepMode
      ? '0 4px 20px rgba(45, 50, 80, 0.45)'
      : '0 4px 20px rgba(255, 235, 80, 0.45)'};

  &:active {
    animation: ${btnPress} 0.15s ease;
  }
`;

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function LoungeHome() {
  const { name: userName } = userStore();

  // ── ✅ [추가] API에서 받은 닉네임 상태
  const [apiNickname, setApiNickname] = useState<string | null>(null);

  // ── 취침 목표 시간 상태 (기존 유지)
  const [rawTargetTime, setRawTargetTime] = useState<string | null>(null);

  // ── 그룹 멤버 피드 상태
  const [feedList, setFeedList] = useState<FeedMember[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const displayTime = formatKoreanTime(rawTargetTime);

  // ── 수면 모드 상태 (기존 유지)
  const [isSleepMode, setIsSleepMode] = useState(false);

  // ── 통계 별도 state (기상 버튼 클릭 시 즉시 반영)
  const [sleepingMembers, setSleepingMembers] = useState(0);
  const [achieveRate, setAchieveRate] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ── ✅ [수정] API 호출: nickname + target_time + current_status 모두 반영
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHomeData();
        console.log('[DEBUG] fetchHomeData response:', JSON.stringify(response));

        // API가 { data: {...} } 형태이면 response.data, 최상위에 바로 있으면 response 자체를 사용
        const data = response?.data ?? response;

        if (data) {
          const { nickname, target_time, current_status } = data;

          // 닉네임 반영 (없으면 null → 표시 시점에 fallback 처리)
          setApiNickname(nickname ?? null);

          // 목표 시간 반영
          setRawTargetTime(target_time ?? null);

          // current_status가 'sleeping'이면 수면 모드로 초기화
          setIsSleepMode(current_status === 'sleeping');

          // ── 그룹 멤버 피드 반영: 가능한 키명을 순서대로 시도
          const members =
            data.group_members ??
            data.members ??
            data.groupMembers ??
            null;

          if (Array.isArray(members) && members.length > 0) {
            setFeedList(members as FeedMember[]);
          } else {
            // fallback: 멤버 데이터가 없거나 비어있으면 본인 1명으로 구성
            const selfEntry: FeedMember = {
              id: 'self',
              nickname: nickname ?? userName ?? '사용자',
              status: (current_status as SleepStatus) ?? 'before_sleep',
            };
            setFeedList([selfEntry]);
          }
        }
      } catch (err) {
        console.error('[LoungeHome] fetchHomeData 실패:', err);
      } finally {
        setIsFeedLoading(false);
      }
    };

    loadData();
  }, []);

  // ── 폰 뒤집기 감지 (Android 및 기타 기기)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // beta: 앞뒤 기울기 (-180 ~ 180)
      // gamma: 좌우 기울기 (-90 ~ 90)
      // 폰이 뒤집힌 상태 = beta가 -90도 이하이거나 gamma의 절댓값이 90에 가까울 때
      if (e.beta !== null && Math.abs(e.beta) > 150) {
        setIsSleepMode(true);
      }
    };

    // iOS 13+ 권한 요청 필요
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS: 버튼 클릭 등 사용자 인터랙션 후에만 권한 요청 가능
      // → 수면 시작 버튼 클릭 시 권한 요청하도록 handleSleepStart에 추가
    } else {
      // Android 및 기타: 바로 이벤트 등록
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // ── feedList 변경 시 통계 동기화
  useEffect(() => {
    const total = feedList.length;
    const sleeping = feedList.filter(m =>
      m.status === 'sleeping' || m.status === 'SLEEPING'
    ).length;
    setSleepingMembers(sleeping);
    setAchieveRate(total > 0 ? Math.round((sleeping / total) * 100) : 0);
  }, [feedList]);

  // ── computed (기존 유지)
  //    getRemainingTimeText(null) 은 timeUtils에서 "목표 시간을 설정해 주세요" 반환 필요
  //    → 아래에서 null 케이스를 안전하게 처리
  const remainingText = rawTargetTime
    ? getRemainingTimeText(rawTargetTime)
    : '목표 시간을 설정해 주세요';

  // ── 통계는 별도 state로 관리 (sleepingMembers, achieveRate)
  console.log('[DEBUG] feedList:', JSON.stringify(feedList));
  const totalMembers = feedList.length;

  // ── ✅ [수정] 표시할 닉네임 우선순위: API > userStore > '사용자'
  const displayName = apiNickname || userName || '사용자';

  const handleSleepStart = async () => {
    // iOS 13+ 권한 요청
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
            if (e.beta !== null && Math.abs(e.beta) > 150) {
              setIsSleepMode(true);
            }
          });
        }
      } catch (err) {
        console.error('방향 센서 권한 요청 실패:', err);
      }
    }

    const newSleepMode = !isSleepMode;
    setIsSleepMode(newSleepMode);

    // feedList에서 현재 사용자의 status도 함께 업데이트 → sleepingMembers / achieveRate 반영
    // nickname 매칭 실패 대비 id === 'self' OR 조건 추가
    const newFeed = feedList.map(m =>
      m.nickname === displayName || m.id === 'self'
        ? { ...m, status: (newSleepMode ? 'sleeping' : 'before_sleep') as SleepStatus }
        : m
    );
    setFeedList(newFeed);

    // 기상 버튼 클릭 시 달성률·취침 현황 즉시 반영
    const total = newFeed.length;
    const sleeping = newFeed.filter(m =>
      m.status === 'sleeping' || m.status === 'SLEEPING'
    ).length;
    setSleepingMembers(sleeping);
    setAchieveRate(total > 0 ? Math.round((sleeping / total) * 100) : 0);

    console.log(newSleepMode ? '수면 시작!' : '기상!');
  };
  const navigate = useNavigate();

  return (
    <PageRoot $isSleepMode={isSleepMode}>

      <Header>
        <IconBtn aria-label="설정 열기" onClick={() => setIsSettingsOpen(true)}>
          <img
            src={isSleepMode ? '/settings2.png' : '/settings.png'}
            alt="설정"
            style={{ width: '24px', height: '24px' }}
          />
        </IconBtn>
        <LogoImg
          src={isSleepMode ? '/logo_white.png' : '/logo_black.png'}
          alt="SleepMate"
        />
        <IconBtn aria-label="메뉴 열기" onClick={() => setIsMenuOpen(true)}>
          <img
            src={isSleepMode ? '/menu2.png' : '/menu.png'}
            alt="메뉴"
            style={{ width: '24px', height: '24px' }}
          />
        </IconBtn>
      </Header>

      <Main>

        <MoonSection aria-label="수면 현황">
          <MoonImg src="/moon.png" alt="달" />
          <SleepCountText>
            {totalMembers}명 중 {sleepingMembers}명 취침 중
          </SleepCountText>
          <AchievementText>달성률 {achieveRate}%</AchievementText>
        </MoonSection>

        <StatusCard as="section" aria-label="내 상태" $isSleepMode={isSleepMode}>
          <StatusHalf>
            <CardLabel $isSleepMode={isSleepMode}>현재 내 상태</CardLabel>
            <AvatarRow>
              <Avatar
                status={isSleepMode ? 'sleeping' : 'before_sleep'}
                isSleepMode={isSleepMode}
              />
              <div>
                {/* ✅ [수정] API 닉네임 우선 표시 */}
                <UserName $isSleepMode={isSleepMode}>{displayName}</UserName>
                <StatusDotLine $color={isSleepMode ? T.sleeping : T.beforeSleep}>
                  <span>●</span> {isSleepMode ? '취침 중' : '취침 전'}
                </StatusDotLine>
              </div>
            </AvatarRow>
          </StatusHalf>

          <VDivider $isSleepMode={isSleepMode} />

          <StatusHalf $end>
            <CardLabel $isSleepMode={isSleepMode}>취침 목표 시간</CardLabel>
            {/* ✅ target_time null이면 "시간 미설정" (formatKoreanTime 처리) */}
            <TargetTime $isSleepMode={isSleepMode}>{displayTime}</TargetTime>
            {/* ✅ target_time null이면 "목표 시간을 설정해 주세요" */}
            <RemainingHint $isSleepMode={isSleepMode}>{remainingText}</RemainingHint>
          </StatusHalf>
        </StatusCard>

        <FeedCard as="section" aria-label="실시간 피드" $isSleepMode={isSleepMode}>
          <FeedCardLabel $isSleepMode={isSleepMode}>실시간 피드</FeedCardLabel>
          {isFeedLoading ? (
            <p style={{ fontSize: '0.8rem', color: T.textMuted, textAlign: 'center', padding: '8px 0' }}>
              불러오는 중...
            </p>
          ) : feedList.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: T.textMuted, textAlign: 'center', padding: '8px 0' }}>
              그룹 멤버가 없습니다.
            </p>
          ) : (
            <FeedList>
              {feedList.filter(m => m.nickname !== apiNickname).map((m, i) => {
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
                    <PokeBtn aria-label={`${m.nickname}님 콕 찌르기`} type="button">
                      <img src="/hand.png" alt="콕 찌르기" />
                    </PokeBtn>
                  </FeedItem>
                );
              })}
            </FeedList>
          )}
        </FeedCard>

      </Main>

      <TownImg src="/town.png" alt="" aria-hidden="true" />

      <FloatArea>
        <SleepBtnStyled
          onClick={handleSleepStart}
          $isSleepMode={isSleepMode}
          aria-label={isSleepMode ? '기상하기' : '수면 시작'}
        >
          {isSleepMode ? '🌅 기상하기' : '🌙 수면 시작'}
        </SleepBtnStyled>
      </FloatArea>

      <MenuOverlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <MenuPanel $isOpen={isMenuOpen} $isSleepMode={isSleepMode}>
        <MenuHeader>
          <MenuTitle $isSleepMode={isSleepMode}>Menu</MenuTitle>
          <MenuCloseBtn $isSleepMode={isSleepMode} onClick={() => setIsMenuOpen(false)}>✕</MenuCloseBtn>
        </MenuHeader>

        <MenuDivider $isSleepMode={isSleepMode} />

        <MenuList>
          <MenuItem $isSleepMode={isSleepMode}>👤 마이페이지</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuItem $isSleepMode={isSleepMode}>🏠 메인 홈</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuItem $isSleepMode={isSleepMode}>🔔 소식 / 알림</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuItem $isSleepMode={isSleepMode}>📋 리포트</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuItem $isSleepMode={isSleepMode}>📢 공지사항</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuItem $isSleepMode={isSleepMode}>❓ 고객센터</MenuItem>
          <MenuDivider $isSleepMode={isSleepMode} />
        </MenuList>
      </MenuPanel>

      <SettingsOverlay $isOpen={isSettingsOpen} onClick={() => setIsSettingsOpen(false)} />
      <SettingsPanel $isOpen={isSettingsOpen} $isSleepMode={isSleepMode}>
        <SettingsHeader>
          <SettingsTitle $isSleepMode={isSleepMode}>Settings</SettingsTitle>
          <SettingsCloseBtn $isSleepMode={isSleepMode} onClick={() => setIsSettingsOpen(false)}>✕</SettingsCloseBtn>
        </SettingsHeader>

        <SettingsProfile>
          <SettingsAvatar src="/profile1.png" alt="프로필" />
          <SettingsName $isSleepMode={isSleepMode}>{apiNickname || '사용자'}</SettingsName>
          <SettingsSubText $isSleepMode={isSleepMode}>계정 설정</SettingsSubText>
        </SettingsProfile>

        <SettingsDivider $isSleepMode={isSleepMode} />

        <SettingsMenuList>
          <SettingsMenuItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/time')}>🕐 수면 시간 설정</SettingsMenuItem>
          <SettingsDivider $isSleepMode={isSleepMode} />
          <SettingsMenuItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/nickname')}>👤 닉네임 설정</SettingsMenuItem>
          <SettingsDivider $isSleepMode={isSleepMode} />
          <SettingsMenuItem $isSleepMode={isSleepMode}>👥 그룹 설정</SettingsMenuItem>
          <SettingsDivider $isSleepMode={isSleepMode} />
          <SettingsMenuItem $isSleepMode={isSleepMode}>🔔 알림 설정</SettingsMenuItem>
          <SettingsDivider $isSleepMode={isSleepMode} />
        </SettingsMenuList>
      </SettingsPanel>

    </PageRoot>
  );
}