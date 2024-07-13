import RenderProfile from './RenderProfile';
import { Metadata } from 'next';
import getUserProfile from '@/lib/getUserProfile';

export async function generateMetadata({ params }) {
  const { id } = params;
  const data = await getUserProfile(id);
  return {
    title: `${data.nickname}ㅣKEYNUT`,
  };
}

export default function Profile() {
  return <RenderProfile />;
}
