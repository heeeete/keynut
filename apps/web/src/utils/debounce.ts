export default function debounce(
  func: (...args: any[]) => void,
  wait: number,
): (...args: any[]) => void {
  let id: ReturnType<typeof setTimeout>;

  return function (...args: any[]): void {
    clearTimeout(id);
    id = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
