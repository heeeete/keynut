const getImageSize = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${url}`;
  });
};

export default getImageSize;
