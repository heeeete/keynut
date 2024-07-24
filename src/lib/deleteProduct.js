const deleteProduct = async (id, callback) => {
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      callback();
      return;
    } else {
      const { error } = await res.json();
      throw new Error(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export default deleteProduct;
