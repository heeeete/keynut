const getUserProducts = async id => {
  const res = await fetch(`/api/user/${id}/products`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }
  const data = await res.json();
  return data;
  //   setProducts(data);
};

export default getUserProducts;
