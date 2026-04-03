// src/pages/LoungeHome.tsx

import { useState, useEffect, useRef } from 'react';
import { useFaceDownDetector } from '../hooks/useFaceDownDetector';
import styled, { keyframes } from 'styled-components';
import { userStore } from '../stores/UserStore';
import { getRemainingTimeText } from '../utils/timeUtils';
import { fetchHomeData, fetchFeedData, sendPoke, fetchPokeNotification, startSleep, stopSleep } from '../utils/api';
import { supabase } from '../utils/auth';
import PokeOverlay from '../components/PokeOverlay';
import Report from './Report';
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
  justify-content: flex-end;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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


const MenuProfile = styled.div`
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MenuAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
`;

const MenuName = styled.p<{ $isSleepMode: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  margin: 0;
  transition: color 0.6s ease;
`;

const MenuSubText = styled.p<{ $isSleepMode: boolean }>`
  font-size: 0.8rem;
  color: ${({ $isSleepMode }) => ($isSleepMode ? 'rgba(255,255,255,0.55)' : '#9CA3AF')};
  margin: 0;
  transition: color 0.6s ease;
`;

const MenuSettingsList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
`;

const MenuSettingsItem = styled.li<{ $isSleepMode: boolean }>`
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

const MenuSearchWrapper = styled.div`
  padding: 16px 20px;
  margin-top: auto;
`;

const MenuSearchInput = styled.input<{ $isSleepMode: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid ${({ $isSleepMode }) =>
    $isSleepMode ? 'rgba(255,255,255,0.18)' : '#E5E7EB'};
  background: ${({ $isSleepMode }) =>
    $isSleepMode ? 'rgba(255,255,255,0.08)' : '#F9FAFB'};
  color: ${({ $isSleepMode }) => ($isSleepMode ? '#FFFFFF' : '#1F2937')};
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.6s ease, background 0.6s ease;
  &::placeholder {
    color: ${({ $isSleepMode }) =>
      $isSleepMode ? 'rgba(255,255,255,0.35)' : '#9CA3AF'};
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
  const [sessionId, setSessionId] = useState<string | null>(null);

  // ── 통계 별도 state (기상 버튼 클릭 시 즉시 반영)
  const [sleepingMembers, setSleepingMembers] = useState(0);
  const [achieveRate, setAchieveRate] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // ── 찌르기 오버레이 상태
  const [pokeMessage, setPokeMessage] = useState<string | null>(null);
  const [pokeExiting, setPokeExiting] = useState(false);
  const pokeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** 찌르기 배너를 표시하고 2.5초 후 fadeOut, 2.85초 후 제거 */
  const showPokeBanner = (msg: string) => {
    pokeTimersRef.current.forEach(clearTimeout);
    pokeTimersRef.current = [];
    setPokeMessage(msg);
    setPokeExiting(false);
    const t1 = setTimeout(() => setPokeExiting(true), 2500);
    const t2 = setTimeout(() => {
      setPokeMessage(null);
      setPokeExiting(false);
    }, 2850);
    pokeTimersRef.current = [t1, t2];
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => { pokeTimersRef.current.forEach(clearTimeout); };
  }, []);

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

          // ── 그룹 멤버 피드 반영: /api/feed 엔드포인트에서 별도 조회
          const feedResponse = await fetchFeedData();
          const feedData = feedResponse?.data ?? null;

          if (Array.isArray(feedData) && feedData.length > 0) {
            const members: FeedMember[] = feedData.map((m: { user_id: string; nickname: string; status: string }) => ({
              id: m.user_id,
              nickname: m.nickname,
              status: m.status as SleepStatus,
            }));
            setFeedList(members);
          } else {
            setFeedList([]);
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

  // ── 폰 뒤집기 감지: isSleepMode일 때만 활성화
  const { isFaceDown } = useFaceDownDetector(isSleepMode);

  // ── feedList 변경 시 통계 동기화
  useEffect(() => {
    const total = feedList.length;
    const sleeping = feedList.filter(m =>
      m.status === 'sleeping'
    ).length;
    setSleepingMembers(sleeping);
    setAchieveRate(total > 0 ? Math.round((sleeping / total) * 100) : 0);
  }, [feedList]);

  // ── 찌르기 수신 폴링 (5초 간격)
  // TODO: 백엔드에서 GET /api/poke/notification 구현 후 활성화됩니다
  useEffect(() => {
    const poll = async () => {
      const result = await fetchPokeNotification();
      if (result?.fromNickname) {
        showPokeBanner(`${result.fromNickname}님이 콕 찔렀어요.`);
      }
    };
    const intervalId = setInterval(poll, 5000);
    return () => clearInterval(intervalId);
  // showPokeBanner는 render마다 재생성되지 않도록 deps에서 제외
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Supabase Realtime: 다른 멤버 수면 상태 변경 실시간 반영
  useEffect(() => {
    const channel = supabase
      .channel('realtime-sleep-feed')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users' },
        (payload) => {
          console.log('Realtime 상태 변경 감지:', payload);
          const updated = payload.new as { id: string; nickname: string; current_status: string };
          setFeedList(prev => prev.map(m =>
            m.id === updated.id
              ? { ...m, status: (updated.current_status || m.status) as SleepStatus }
              : m
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── computed (기존 유지)
  //    getRemainingTimeText(null) 은 timeUtils에서 "목표 시간을 설정해 주세요" 반환 필요
  //    → 아래에서 null 케이스를 안전하게 처리
  const remainingText = rawTargetTime
    ? getRemainingTimeText(rawTargetTime)
    : '목표 시간을 설정해 주세요';

  // ── 통계는 별도 state로 관리 (sleepingMembers, achieveRate)
  console.log('[DEBUG] feedList:', JSON.stringify(feedList));
  const totalMembers = feedList.length;

  // ── 실시간 피드에서 현재 로그인한 유저 제외
  const visibleFeed = feedList.filter(m => m.nickname !== apiNickname);

  // ── ✅ [수정] 표시할 닉네임 우선순위: API > userStore > '사용자'
  const displayName = apiNickname || userName || '사용자';

  const handlePoke = async (target: FeedMember) => {
    showPokeBanner(`${target.nickname}님을 콕 찔렀습니다.`);
    // TODO: 백엔드 POST /api/poke 구현 후 실제 전송됩니다
    await sendPoke(target.id);
  };

  const handleSleepStart = async () => {
    const newSleepMode = !isSleepMode;

    // iOS 13+: 수면 시작 시 방향 센서 권한 요청 (사용자 제스처 내에서 호출해야 함)
    if (
      newSleepMode &&
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        await (DeviceOrientationEvent as any).requestPermission();
      } catch (err) {
        console.error('방향 센서 권한 요청 실패:', err);
      }
    }

    if (newSleepMode) {
      // 수면 시작
      const result = await startSleep('');
      if (!result || result.status !== 'success') {
        console.error('수면 시작 API 실패');
        return;
      }
      setSessionId(result.data?.session_id ?? null);
    } else {
      // 기상
      if (sessionId) {
        const result = await stopSleep(sessionId);
        if (!result || result.status !== 'success') {
          console.error('기상 API 실패');
          return;
        }
      }
      setSessionId(null);
    }

    // API 성공 후 로컬 state 업데이트
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
      m.status === 'sleeping'
    ).length;
    setSleepingMembers(sleeping);
    setAchieveRate(total > 0 ? Math.round((sleeping / total) * 100) : 0);

    console.log(newSleepMode ? '수면 시작!' : '기상!');
  };
  const navigate = useNavigate();

  // 수면 모드 + 폰 뒤집힌 상태 → 완전 검정 화면
  if (isSleepMode && isFaceDown) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        zIndex: 9999,
      }} />
    );
  }

  return (
    <PageRoot $isSleepMode={isSleepMode}>

      <Header>
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
          ) : visibleFeed.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: T.textMuted, textAlign: 'center', padding: '8px 0' }}>
              그룹 멤버가 없습니다.
            </p>
          ) : (
            <FeedList>
              {visibleFeed.map((m, i) => {
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
                    <PokeBtn
                      aria-label={`${m.nickname}님 콕 찌르기`}
                      type="button"
                      onClick={() => handlePoke(m)}
                    >
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

      {/* 찌르기 오버레이: 찌른 경우 "OO님을 콕 찔렀습니다." / 찔린 경우 "OO님이 콕 찔렀어요." */}
      {pokeMessage && (
        <PokeOverlay message={pokeMessage} exiting={pokeExiting} />
      )}

      <MenuOverlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <MenuPanel $isOpen={isMenuOpen} $isSleepMode={isSleepMode}>
        <MenuHeader>
          <MenuTitle $isSleepMode={isSleepMode}>Menu</MenuTitle>
          <MenuCloseBtn $isSleepMode={isSleepMode} onClick={() => setIsMenuOpen(false)}>✕</MenuCloseBtn>
        </MenuHeader>

        <MenuDivider $isSleepMode={isSleepMode} />

        <MenuProfile>
          <MenuAvatar src="/profile1.png" alt="프로필" />
          <MenuName $isSleepMode={isSleepMode}>{apiNickname || '사용자'}</MenuName>
          <MenuSubText $isSleepMode={isSleepMode}>마이페이지</MenuSubText>
        </MenuProfile>

        <MenuDivider $isSleepMode={isSleepMode} />

        <MenuSettingsList>
          <MenuSettingsItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/time')}>🕐 수면 시간 설정</MenuSettingsItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuSettingsItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/nickname')}>👤 닉네임 설정</MenuSettingsItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuSettingsItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/group')}>👥 그룹 설정</MenuSettingsItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuSettingsItem $isSleepMode={isSleepMode} onClick={() => navigate('/setting/alarm')}>🔔 알림 설정</MenuSettingsItem>
          <MenuDivider $isSleepMode={isSleepMode} />
          <MenuSettingsItem $isSleepMode={isSleepMode} onClick={() => { setIsMenuOpen(false); setIsReportOpen(true); }}>📋 리포트</MenuSettingsItem>
          <MenuDivider $isSleepMode={isSleepMode} />
        </MenuSettingsList>

        <MenuSearchWrapper>
          <MenuSearchInput
            $isSleepMode={isSleepMode}
            type="text"
            placeholder="검색"
          />
        </MenuSearchWrapper>
      </MenuPanel>

      {isReportOpen && <Report onClose={() => setIsReportOpen(false)} />}
    </PageRoot>
  );
}