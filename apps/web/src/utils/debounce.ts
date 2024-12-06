export default function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let id: NodeJS.Timeout;

  return function (...args: any[]): void {
    clearTimeout(id);
    id = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
