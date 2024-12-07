const deleteProduct = async (id: string, callback?: () => void) => {
  let res: Response | number | undefined;
  try {
    res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (callback) callback();
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
