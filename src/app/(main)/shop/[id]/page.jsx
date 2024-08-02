import RenderProfile from './RenderProfile';
import { Metadata } from 'next';
import getUserProfile from '@/lib/getUserProfile';

export async function generateMetadata({ params }) {
  const { id } = params;
  const data = await getUserProfile(id);
  // console.log(data);
  return {
    title: data ? `${data.nickname}ㅣKEYNUT` : 'KEYNUT',
    openGraph: {
      title: data ? `${data.nickname}ㅣKEYNUT` : 'KEYNUT',
      description: data ? `${data.nickname}님의 상점` : '상점을 찾을 수 없습니다.',
      images: [
        {
          url: data ? data.image : `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`,
          width: 400,
          height: 400,
        },
      ],
    },
  };
}

export default function Profile() {
  return <RenderProfile />;
}
