const onClickProduct = e => {
  const target = e.currentTarget;
  // console.log('asdlkf;laskd;lf');
  target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  setTimeout(() => {
    target.style.backgroundColor = 'transparent';
  }, 50);
};
export default onClickProduct;
