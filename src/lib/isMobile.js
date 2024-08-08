export function isMobile() {
  if (typeof window !== 'undefined') {
    if (navigator.maxTouchPoints > 1) {
      const isMobile = /Macintosh|iPad|Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
      if (isMobile) return true;
      return false;
    }
    return false;
  }
}
