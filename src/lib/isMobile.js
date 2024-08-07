export function isMobile() {
  if (typeof window !== 'undefined') {
    if (navigator.maxTouchPoints > 1) {
      const isIPad = /Macintosh|iPad/.test(navigator.userAgent);
      if (isIPad) return true;
      return false;
    }
    return /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
}
