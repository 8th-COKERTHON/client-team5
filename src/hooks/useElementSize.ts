import { useEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * ref를 건 엘리먼트의 실시간 크기를 반환한다.
 * MobileFrame이 모바일에서는 100dvh, 웹에서는 390x844로 바뀌므로
 * react-globe.gl 캔버스 크기를 그때그때 맞추기 위해 사용한다.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
