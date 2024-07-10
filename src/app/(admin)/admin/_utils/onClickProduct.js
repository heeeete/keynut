const onClickProduct = e => {
  const target = e.currentTarget;
  target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  setTimeout(() => {
    target.style.backgroundColor = 'transparent';
  }, 50);
};
export default onClickProduct;
