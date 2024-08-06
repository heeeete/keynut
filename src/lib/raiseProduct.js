const raiseProduct = async (id, callback) => {
  try {
    const res = await fetch(`/api/products/${id}/raise`, { method: 'PATCH' });
    if (res.ok) {
      callback();
    } else {
      const { error } = await res.json();
      alert('오류가 발생했습니다. 잠시후 다시 시도해주세요.');
      throw new Error(error);
    }
  } catch (error) {
    alert('오류가 발생했습니다. 잠시후 다시 시도해주세요.');
    console.log(error);
  }
};

export default raiseProduct;
