import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function GET() {
  try {
    // 정적 파일 경로
    const filePath = path.join(process.cwd(), 'public/models/case_cherry.glb');

    // 파일 크기 가져오기
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Node.js ReadableStream 생성
    const fileStream = fs.createReadStream(filePath);

    // Node.js ReadableStream을 Web Stream으로 변환
    const webStream = Readable.toWeb(fileStream);

    // 응답 헤더 설정
    const headers = new Headers({
      'Content-Length': fileSize.toString(),
      'Content-Type': 'application/octet-stream',
    });

    return new NextResponse(webStream, { headers });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
