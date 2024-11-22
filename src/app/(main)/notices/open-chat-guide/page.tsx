'use server';

export default async function OpenChatGuide() {
  return (
    <div className="flex justify-center max-w-screen-xl mx-auto max-md:main-768">
      <object data="/guide/kakao-guide.svg" className="max-w-4xl w-full h-full"></object>
    </div>
  );
}
