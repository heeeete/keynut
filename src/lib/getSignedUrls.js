'use client';

export default async function getSignedUrls(files) {
  let res;
  const encodeNames = files.map(file => encodeURIComponent(file.name));
  console.log(encodeNames);
  try {
    res = await fetch('/api/s3/get-signed-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ names: encodeNames }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    console.log(data);
    return { urls: data.urls, status: res.status };
  } catch (error) {
    console.error(error.message);
    return { status: res.status };
  }
}
