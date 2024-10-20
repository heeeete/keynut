import { User } from '@/type/user';
import RenderProfile from './RenderProfile';
import getUserProfile from '@/lib/getUserProfile';

export async function generateMetadata({ params }) {
  const { id }: { id: string } = params;
  const data: User = await getUserProfile(id);
  return {
    title: data ? `${data.nickname}ㅣKEYNUT - 키넛` : 'KEYNUT - 키넛',
    openGraph: {
      title: data ? `${data.nickname}ㅣKEYNUT - 키넛` : 'KEYNUT - 키넛',
      description: data ? `${data.nickname}님의 상점` : '상점을 찾을 수 없습니다.',
      images: [
        {
          url: data
            ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${data.image}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/keynut.png`,
          width: 500,
          height: 500,
          alt: 'KEYNUT Logo',
        },
      ],
    },
  };
}

export default function Profile() {
  return <RenderProfile />;
}
