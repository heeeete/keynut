'use client';

import { useEffect, useRef } from 'react';

function saveScrollPos() {
  // 현재 스크롤 위치를 세션 스토리지에 저장
  sessionStorage.setItem('scrollPos', window.scrollY);
}

function restoreScrollPos() {
  // 복원시킬 스크롤 위치가 존재하면
  // 브라우저 스크롤 위치를 해당 값으로 이동시킨 후, 세션 스토리지에서 이전 위치 정보 제거
  const scrollPos = sessionStorage.getItem('scrollPos');
  if (scrollPos) {
    window.scrollTo(0, scrollPos);
    sessionStorage.removeItem('scrollPos');
  }
}

export default function useScrollResotration(router) {
  // 스크롤 복원 여부 확인을 위해 사용되는 flag 값
  const shouldScrollRestore = useRef(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      shouldScrollRestore.current = false;
      // 스크롤 복원 기본 동작을 수동으로 제어
      window.history.scrollRestoration = 'manual';

      // 페이지 이동 시작 시 스크롤 위치 저장
      const onRouteChangeStart = () => {
        if (!shouldScrollRestore.current) {
          saveScrollPos();
        }
      };

      // (브라우저 뒤로 가기 동작으로 인한) 페이지 이동 완료 시
      // 스크롤을 이전 위치로 복원
      const onRouteChangeComplete = () => {
        if (shouldScrollRestore.current) {
          shouldScrollRestore.current = false;
          restoreScrollPos();
        }
      };

      router.events.on('routeChangeStart', onRouteChangeStart);
      router.events.on('routeChangeComplete', onRouteChangeComplete);
      router.beforePopState(() => {
        shouldScrollRestore.current = true;
        return true;
      });

      return () => {
        router.events.off('routeChangeStart', onRouteChangeStart);
        router.events.off('routeChangeComplete', onRouteChangeComplete);
        router.beforePopState(() => true);
      };
    }
  }, [router]);
}
