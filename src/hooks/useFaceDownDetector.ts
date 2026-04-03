// src/hooks/useFaceDownDetector.ts
// 웹 API(DeviceOrientationEvent)로 폰 face-down 감지
// isActive가 false이면 센서 구독 중단 및 isFaceDown 초기화
import { useState, useEffect, useRef } from 'react';

export function useFaceDownDetector(isActive: boolean) {
  const [isFaceDown, setIsFaceDown] = useState(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setIsFaceDown(false);
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 300) return; // 300ms 인터벌
      lastUpdateRef.current = now;

      if (e.beta === null) return;

      // |beta| > 150 → 화면이 아래를 향함 (face-down)
      // |beta| < 30  → 화면이 위를 향함 (face-up)
      if (Math.abs(e.beta) > 150) {
        setIsFaceDown(true);
      } else if (Math.abs(e.beta) < 30) {
        setIsFaceDown(false);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isActive]);

  return { isFaceDown };
}
