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
      images: [
        {
          url: data ? data.image : '/keynut',
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
