'use client';

export default async function getSignedUrls(imageDetails) {
  let res;

  try {
    res = await fetch('/api/s3/get-signed-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageDetails }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return { urls: data.urls, status: res.status };
  } catch (error) {
    console.error(error.message);
    return { status: res ? res.status : 500 };
  }
}
