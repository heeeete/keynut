const deleteProduct = async (id, callback = () => {}) => {
  let res;
  try {
    res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      callback();
      return 200;
    } else {
      const { error } = await res.json();
      res = res.status;
      throw new Error(error);
    }
  } catch (error) {
    console.error(error);
    return res ? res : 500;
  }
};

export default deleteProduct;
