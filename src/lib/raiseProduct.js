const raiseProduct = async (id, callback) => {
  try {
    const res = await fetch(`/api/products/${id}/raise`, { method: 'PATCH' });
    if (res.ok) {
      callback();
    } else {
      alert('오류가 발생했습니다. 잠시후 다시 시도해주세요.');
      location.reload();
    }
  } catch (error) {
    alert('오류가 발생했습니다. 잠시후 다시 시도해주세요.');
    location.reload();
  }
};

export default raiseProduct;
