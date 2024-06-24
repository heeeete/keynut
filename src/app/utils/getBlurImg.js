const getBlurImg = async imgSrc => {
  try {
    const res = await fetch(`/api/blur?imgSrc=${encodeURIComponent(imgSrc)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch blur image');
    }
    const { base64 } = await res.json();
    return base64;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default getBlurImg;
