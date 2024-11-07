interface FileType {
  file?: File;
  name?: string;
  width: number;
  height: number;
}

export default async function uploadToS3(url: string, file: FileType) {
  let res: Response;

  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.file.type,
      },
      body: file.file,
    });

    if (!res.ok) throw new Error('Failed to upload file to S3');
    return url.split('?')[0]; // 업로드된 파일의 URL 반환
  } catch (error) {
    console.error(error.message);
    return { status: res ? res.status : 500 };
  }
}
