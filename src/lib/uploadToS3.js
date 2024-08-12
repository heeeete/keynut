export default async function uploadToS3(url, file) {
  let res;
  const { type } = file;
  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': type,
      },
      body: file,
    });

    if (!res.ok) throw new Error('Failed to upload file to S3');
    return url.split('?')[0]; // 업로드된 파일의 URL 반환
  } catch (error) {
    console.error(error.message);
    return { status: res ? res.status : 500 };
  }
}
