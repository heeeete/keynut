export default function debounce(func, wait) {
  let id;
  return function () {
    clearTimeout(id);
    id = setTimeout(func, wait);
  };
}
