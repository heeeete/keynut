'use server';
import timeAgo from '@/utils/timeAgo';

export default function RenderTimeAgo({ date }) {
  return <p>{timeAgo(date.date)}</p>;
}
