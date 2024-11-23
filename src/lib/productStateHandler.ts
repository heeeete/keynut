const productStateHandler = async (productId: string, state: number) => {
  let res;
  try {
    res = await fetch(`/api/products/${productId}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
    return res.status;
  } catch (error) {
    console.error(error);
    return 500;
  }
};

export default productStateHandler;
