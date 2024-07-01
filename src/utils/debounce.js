export default function debounce(func, wait) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
