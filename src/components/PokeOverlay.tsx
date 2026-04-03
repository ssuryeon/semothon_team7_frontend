// src/components/PokeOverlay.tsx
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-14px); }
`;

const BannerOuter = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
`;

const BannerInner = styled.div<{ $exiting: boolean }>`
  width: 100%;
  max-width: 390px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.80);
  box-shadow:
    0 8px 32px rgba(30, 50, 100, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.70);
  padding: 16px 20px;
  text-align: center;
  animation: ${({ $exiting }) => ($exiting ? slideOut : slideIn)} 0.35s ease both;
`;

const BannerText = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #1F2937;
  letter-spacing: -0.01em;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
`;

interface PokeOverlayProps {
  message: string;
  exiting: boolean;
}

export default function PokeOverlay({ message, exiting }: PokeOverlayProps) {
  return (
    <BannerOuter>
      <BannerInner $exiting={exiting}>
        <BannerText>{message}</BannerText>
      </BannerInner>
    </BannerOuter>
  );
}
