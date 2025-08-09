'use client';

interface ImageDetails {
  file?: File;
  name?: string;
  width: number;
  height: number;
}

interface SignedUrlsResponse {
  urls?: string[];
  status: number;
}

export default async function getSignedUrls(
  imageDetails: ImageDetails[],
): Promise<SignedUrlsResponse> {
  let res: Response | undefined;

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
    console.error(error);
    return { status: res ? res.status : 500 };
  }
}
